/**
 * Pusher server configuration for real-time multiplayer functionality
 */
import Pusher from 'pusher';
import { env } from '~/env.js';

let pusherServer: Pusher | null = null;

export const getPusherServer = (): Pusher => {
  if (!pusherServer) {
    if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
      console.warn('Pusher server configuration missing. Creating mock server for development.');
      // Return a mock pusher server for development
      return {
        trigger: async () => ({ channels: {}, cursor: '' }),
        authenticate: () => ({}),
        authorizeChannel: () => ({}),
      } as any;
    }

    pusherServer = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }

  return pusherServer;
};

// Game event handlers
export class GameEventService {
  private pusher: Pusher;

  constructor() {
    this.pusher = getPusherServer();
  }

  private getChannelName(roomId: string): string {
    return `game-room-${roomId}`;
  }

  async playerJoined(roomId: string, userId: string, nickname: string, playersCount: number) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-player-joined', {
      userId,
      nickname,
      playersCount,
    });
  }

  async playerReady(roomId: string, userId: string, readyCount: number) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-player-ready', {
      userId,
      readyCount,
    });
  }

  async gameStart(roomId: string, question: {
    id: string;
    text: string;
    category: string;
    options: string[];
  }, round: number) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-game-start', {
      question,
      round,
    });
  }

  async roundResult(roomId: string, data: {
    correctAnswer: string;
    results: Array<{
      userId: string;
      nickname: string;
      answer: string;
      isCorrect: boolean;
      timeUsed: number;
      score: number;
    }>;
    scores: Array<{
      userId: string;
      totalScore: number;
    }>;
  }) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-round-result', data);
  }

  async gameEnd(roomId: string, data: {
    winner: {
      userId: string;
      nickname: string;
      score: number;
    };
    finalScores: Array<{
      userId: string;
      nickname: string;
      score: number;
    }>;
  }) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-game-end', data);
  }

  async playerDisconnected(roomId: string, userId: string, nickname: string) {
    await this.pusher.trigger(this.getChannelName(roomId), 'server-player-disconnected', {
      userId,
      nickname,
    });
  }

  // Authenticate channel access (for private channels if needed)
  authenticateChannel(socketId: string, channel: string, userId: string): any {
    // For now, allow all connections to game rooms
    // In production, you might want to validate that the user is part of the room
    return this.pusher.authenticate(socketId, channel, {
      user_id: userId,
    });
  }
}

export const gameEventService = new GameEventService();
