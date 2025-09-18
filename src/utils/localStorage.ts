/**
 * Utilities for managing local storage with type safety
 */

interface UserSession {
  userId: string;
  nickname: string;
  lastLogin: string;
}

const STORAGE_KEYS = {
  USER_SESSION: 'play-sib-user-session',
  GAME_SETTINGS: 'play-sib-settings',
} as const;

export const localStorage = {
  // User Session Management
  getUserSession: (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setUserSession: (session: UserSession): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save user session:', error);
    }
  },

  clearUserSession: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.warn('Failed to clear user session:', error);
    }
  },

  // Game Settings
  getGameSettings: () => {
    if (typeof window === 'undefined') return { soundEnabled: true, musicEnabled: true };
    
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      return stored ? JSON.parse(stored) : { soundEnabled: true, musicEnabled: true };
    } catch {
      return { soundEnabled: true, musicEnabled: true };
    }
  },

  setGameSettings: (settings: { soundEnabled: boolean; musicEnabled: boolean }): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save game settings:', error);
    }
  },
};
