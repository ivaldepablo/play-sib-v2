import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const scoreRouter = createTRPCRouter({
  submit: publicProcedure
    .input(z.object({
      userId: z.string(),
      value: z.number().min(0),
      gameMode: z.enum(["SINGLE", "DUEL"]).default("SINGLE"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create new score entry
      const newScore = await ctx.db.score.create({
        data: {
          userId: input.userId,
          value: input.value,
          gameMode: input.gameMode,
        },
      });

      // Update user's high score if this is better
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (user && input.value > user.highScore) {
        await ctx.db.user.update({
          where: { id: input.userId },
          data: { highScore: input.value },
        });
      }

      return newScore;
    }),

  getHistory: publicProcedure
    .input(z.object({
      userId: z.string(),
      gameMode: z.enum(["SINGLE", "DUEL"]).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const scores = await ctx.db.score.findMany({
        where: {
          userId: input.userId,
          ...(input.gameMode && { gameMode: input.gameMode }),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });

      return scores;
    }),

  getStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [totalGames, avgScore, bestScore, recentGames] = await Promise.all([
        ctx.db.score.count({
          where: { userId: input.userId },
        }),
        ctx.db.score.aggregate({
          where: { userId: input.userId },
          _avg: { value: true },
        }),
        ctx.db.score.findFirst({
          where: { userId: input.userId },
          orderBy: { value: "desc" },
        }),
        ctx.db.score.count({
          where: {
            userId: input.userId,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      return {
        totalGames,
        averageScore: Math.round(avgScore._avg.value ?? 0),
        bestScore: bestScore?.value ?? 0,
        recentGames,
      };
    }),
});
