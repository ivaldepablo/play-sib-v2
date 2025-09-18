import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getByCategory: publicProcedure
    .input(z.object({ 
      category: z.string(),
      limit: z.number().default(10) 
    }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.question.findMany({
        where: {
          category: input.category,
          isActive: true,
        },
        take: input.limit,
        orderBy: {
          createdAt: "asc", // Or use random ordering in production
        },
      });

      return questions.map(q => ({
        ...q,
        options: JSON.parse(q.options as string) as string[]
      }));
    }),

  getRandom: publicProcedure
    .input(z.object({ 
      excludeIds: z.array(z.string()).default([]),
      limit: z.number().default(1) 
    }))
    .query(async ({ ctx, input }) => {
      // Get random questions excluding already asked ones
      const questions = await ctx.db.question.findMany({
        where: {
          isActive: true,
          id: {
            notIn: input.excludeIds,
          },
        },
        take: input.limit,
      });

      // Shuffle the results and parse options
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.map(q => ({
        ...q,
        options: JSON.parse(q.options as string) as string[]
      }));
    }),

  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.question.findMany({
        where: { isActive: true },
        orderBy: { category: "asc" },
      });
    }),

  submit: publicProcedure
    .input(z.object({
      text: z.string().min(10).max(500),
      category: z.string().min(1),
      options: z.array(z.string()).length(4),
      answer: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate that answer is one of the options
      if (!input.options.includes(input.answer)) {
        throw new Error("Правильный ответ должен быть одним из вариантов");
      }

      const submittedQuestion = await ctx.db.submittedQuestion.create({
        data: {
          text: input.text,
          category: input.category,
          options: JSON.stringify(input.options),
          answer: input.answer,
          status: "PENDING",
        },
      });

      return submittedQuestion;
    }),

  getSubmitted: publicProcedure
    .input(z.object({
      status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.submittedQuestion.findMany({
        where: input.status ? { status: input.status } : undefined,
        orderBy: { createdAt: "desc" },
      });
    }),
});
