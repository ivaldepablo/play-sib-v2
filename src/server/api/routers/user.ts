import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getOrCreate: publicProcedure
    .input(z.object({ 
      nickname: z.string().min(1).max(20),
      userId: z.string().optional() 
    }))
    .mutation(async ({ ctx, input }) => {
      // If userId provided, try to find existing user
      if (input.userId) {
        const existingUser = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });
        
        if (existingUser) {
          return existingUser;
        }
      }

      // Check if nickname is already taken
      const existingNickname = await ctx.db.user.findUnique({
        where: { nickname: input.nickname },
      });

      if (existingNickname) {
        throw new Error("Este nickname ya está en uso");
      }

      // Create new user
      const newUser = await ctx.db.user.create({
        data: {
          nickname: input.nickname,
        },
      });

      return newUser;
    }),

  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          scores: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user;
    }),

  updateNickname: publicProcedure
    .input(z.object({ 
      userId: z.string(),
      nickname: z.string().min(1).max(20) 
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if nickname is already taken
      const existingNickname = await ctx.db.user.findUnique({
        where: { nickname: input.nickname },
      });

      if (existingNickname && existingNickname.id !== input.userId) {
        throw new Error("Este nickname ya está en uso");
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input.userId },
        data: { nickname: input.nickname },
      });

      return updatedUser;
    }),
});
