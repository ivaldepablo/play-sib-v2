import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  getGlobal: publicProcedure
    .input(z.object({ 
      limit: z.number().default(50),
      gameMode: z.enum(["SINGLE", "DUEL"]).optional() 
    }))
    .query(async ({ ctx, input }) => {
      const topUsers = await ctx.db.user.findMany({
        orderBy: { highScore: "desc" },
        take: input.limit,
        select: {
          id: true,
          nickname: true,
          highScore: true,
          createdAt: true,
        },
      });

      return topUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));
    }),

  getWeekly: publicProcedure
    .input(z.object({ 
      limit: z.number().default(50),
      gameMode: z.enum(["SINGLE", "DUEL"]).optional() 
    }))
    .query(async ({ ctx, input }) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get best scores from the last week
      const weeklyScores = await ctx.db.score.findMany({
        where: {
          createdAt: { gte: weekAgo },
          ...(input.gameMode && { gameMode: input.gameMode }),
        },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
        orderBy: { value: "desc" },
      });

      // Group by user and get their best score this week
      const userBestScores = new Map<string, {
        userId: string;
        nickname: string;
        bestScore: number;
        scoreDate: Date;
      }>();

      weeklyScores.forEach(score => {
        const existing = userBestScores.get(score.userId);
        if (!existing || score.value > existing.bestScore) {
          userBestScores.set(score.userId, {
            userId: score.userId,
            nickname: score.user.nickname,
            bestScore: score.value,
            scoreDate: score.createdAt,
          });
        }
      });

      // Convert to array and sort
      const sortedWeeklyLeaders = Array.from(userBestScores.values())
        .sort((a, b) => b.bestScore - a.bestScore)
        .slice(0, input.limit)
        .map((entry, index) => ({
          id: entry.userId,
          nickname: entry.nickname,
          score: entry.bestScore,
          date: entry.scoreDate,
          rank: index + 1,
        }));

      return sortedWeeklyLeaders;
    }),

  getUserRank: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { highScore: true, nickname: true },
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // Count users with higher scores
      const betterUsers = await ctx.db.user.count({
        where: {
          highScore: { gt: user.highScore },
        },
      });

      const globalRank = betterUsers + 1;

      // Get weekly rank
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const userWeeklyBest = await ctx.db.score.findFirst({
        where: {
          userId: input.userId,
          createdAt: { gte: weekAgo },
        },
        orderBy: { value: "desc" },
      });

      let weeklyRank = null;
      if (userWeeklyBest) {
        const betterWeeklyScores = await ctx.db.score.count({
          where: {
            value: { gt: userWeeklyBest.value },
            createdAt: { gte: weekAgo },
          },
        });
        weeklyRank = betterWeeklyScores + 1;
      }

      return {
        globalRank,
        weeklyRank,
        globalScore: user.highScore,
        weeklyScore: userWeeklyBest?.value ?? 0,
        nickname: user.nickname,
      };
    }),

  getAroundUser: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      range: z.number().default(5) // Show 5 users above and below
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { highScore: true },
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // Get users around the current user's score
      const usersAbove = await ctx.db.user.findMany({
        where: {
          highScore: { gt: user.highScore },
        },
        orderBy: { highScore: "asc" },
        take: input.range,
        select: {
          id: true,
          nickname: true,
          highScore: true,
        },
      });

      const usersBelow = await ctx.db.user.findMany({
        where: {
          highScore: { lt: user.highScore },
        },
        orderBy: { highScore: "desc" },
        take: input.range,
        select: {
          id: true,
          nickname: true,
          highScore: true,
        },
      });

      const currentUser = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          nickname: true,
          highScore: true,
        },
      });

      // Combine and sort
      const allUsers = [
        ...usersAbove.reverse(),
        ...(currentUser ? [currentUser] : []),
        ...usersBelow,
      ].sort((a, b) => b.highScore - a.highScore);

      return allUsers.map((user, index) => ({
        ...user,
        rank: index + 1, // This is relative rank, not absolute
        isCurrent: user.id === input.userId,
      }));
    }),
});
