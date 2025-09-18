import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { scoreRouter } from "~/server/api/routers/score";
import { questionRouter } from "~/server/api/routers/question";
import { leaderboardRouter } from "~/server/api/routers/leaderboard";
import { roomRouter } from "~/server/api/routers/room";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  score: scoreRouter,
  question: questionRouter,
  leaderboard: leaderboardRouter,
  room: roomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
