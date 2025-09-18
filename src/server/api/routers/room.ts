import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * Simplified Room Router for deployment
 * Full multiplayer functionality will be added when GamePlayer model is properly configured
 */
export const roomRouter = createTRPCRouter({
  // Create a new game room (simplified)
  create: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // Generate unique 6-digit room code
      let roomCode: string;
      let existingRoom;
      
      do {
        roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        existingRoom = await ctx.db.gameRoom.findUnique({
          where: { code: roomCode }
        });
      } while (existingRoom);

      // Create room
      const room = await ctx.db.gameRoom.create({
        data: {
          code: roomCode,
          maxPlayers: 2,
          currentRound: 0,
          maxRounds: 5,
        },
      });

      return { roomId: room.id, code: roomCode };
    }),

  // Join an existing room (simplified)  
  join: publicProcedure
    .input(z.object({
      code: z.string().length(6),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.gameRoom.findUnique({
        where: { code: input.code },
      });

      if (!room) {
        throw new Error("Комната не найдена");
      }

      if (room.status !== "WAITING") {
        throw new Error("Комната недоступна для подключения");
      }

      return { 
        roomId: room.id, 
        code: room.code,
        players: [] // Simplified for now
      };
    }),

  // Get room status (simplified)
  getStatus: publicProcedure
    .input(z.object({
      roomId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.gameRoom.findUnique({
        where: { id: input.roomId },
      });

      if (!room) {
        throw new Error("Комната не найдена");
      }

      return {
        id: room.id,
        code: room.code,
        status: room.status,
        maxPlayers: room.maxPlayers,
        currentRound: room.currentRound,
        maxRounds: room.maxRounds,
        players: [] // Simplified for now
      };
    }),
});
