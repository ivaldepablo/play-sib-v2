/**
 * Pusher client configuration for real-time multiplayer functionality
 */
import Pusher from 'pusher-js';
import { env } from '~/env.js';

let pusherClient: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherClient && typeof window !== 'undefined') {
    // Only initialize on client side
    if (!env.NEXT_PUBLIC_PUSHER_KEY || !env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.warn('Pusher configuration missing. Real-time features will be disabled.');
      // Return a mock pusher client for development
      return {
        subscribe: () => ({ bind: () => {}, unbind: () => {} }),
        unsubscribe: () => {},
        disconnect: () => {},
      } as any;
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });

    pusherClient = pusher;

    // Enable logging in development
    if (env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
  }

  return pusherClient!;
};

export const disconnectPusher = (): void => {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
};

// Event types for type safety
export interface GameEvents {
  'client-join-room': {
    userId: string;
    nickname: string;
  };
  'client-ready': {
    userId: string;
  };
  'client-answer': {
    userId: string;
    answer: string;
    timeUsed: number;
  };
  'server-player-joined': {
    userId: string;
    nickname: string;
    playersCount: number;
  };
  'server-player-ready': {
    userId: string;
    readyCount: number;
  };
  'server-game-start': {
    question: {
      id: string;
      text: string;
      category: string;
      options: string[];
    };
    round: number;
  };
  'server-round-result': {
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
  };
  'server-game-end': {
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
  };
  'server-player-disconnected': {
    userId: string;
    nickname: string;
  };
}

export type GameEventName = keyof GameEvents;
