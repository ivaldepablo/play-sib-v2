/**
 * Sound management system using Howler.js
 */
import { Howl } from 'howler';
import { localStorage } from './localStorage';

class SoundManager {
  private sounds: { [key: string]: Howl } = {};
  private initialized = false;

  // Sound URLs (using data URIs for basic sounds or external URLs)
  private soundUrls = {
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    correct: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    incorrect: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    spin: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    gameStart: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    gameEnd: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
    notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmWzGH0fPTgjMGHm7A7+OZURED',
    victory: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfAzGH0fPTgjMGHm7A7+OZURED',
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  private initializeSounds() {
    if (this.initialized) return;

    // Initialize all sounds
    Object.entries(this.soundUrls).forEach(([name, url]) => {
      this.sounds[name] = new Howl({
        src: [url],
        volume: 0.7,
        preload: true,
      });
    });

    this.initialized = true;
  }

  private canPlaySound(): boolean {
    if (typeof window === 'undefined') return false;
    
    const settings = localStorage.getGameSettings();
    return settings.soundEnabled;
  }

  // Public methods to play sounds
  click() {
    if (!this.canPlaySound()) return;
    this.sounds.click?.play();
  }

  correct() {
    if (!this.canPlaySound()) return;
    this.sounds.correct?.play();
  }

  incorrect() {
    if (!this.canPlaySound()) return;
    this.sounds.incorrect?.play();
  }

  spin() {
    if (!this.canPlaySound()) return;
    this.sounds.spin?.play();
  }

  gameStart() {
    if (!this.canPlaySound()) return;
    this.sounds.gameStart?.play();
  }

  gameEnd() {
    if (!this.canPlaySound()) return;
    this.sounds.gameEnd?.play();
  }

  notification() {
    if (!this.canPlaySound()) return;
    this.sounds.notification?.play();
  }

  victory() {
    if (!this.canPlaySound()) return;
    this.sounds.victory?.play();
  }

  // Volume control
  setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume(clampedVolume);
    });
  }

  // Mute/unmute all sounds
  mute() {
    Object.values(this.sounds).forEach(sound => {
      sound.mute(true);
    });
  }

  unmute() {
    Object.values(this.sounds).forEach(sound => {
      sound.mute(false);
    });
  }

  // Stop all sounds
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }

  // Preload sounds for better performance
  preloadAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = {
  click: () => soundManager.click(),
  correct: () => soundManager.correct(),
  incorrect: () => soundManager.incorrect(),
  spin: () => soundManager.spin(),
  gameStart: () => soundManager.gameStart(),
  gameEnd: () => soundManager.gameEnd(),
  notification: () => soundManager.notification(),
  victory: () => soundManager.victory(),
};

// Hook for React components
export const useSounds = () => {
  const settings = localStorage.getGameSettings();
  
  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    localStorage.setGameSettings(newSettings);
    
    if (newSettings.soundEnabled) {
      soundManager.unmute();
      soundManager.click(); // Test sound
    } else {
      soundManager.mute();
    }
  };

  return {
    soundEnabled: settings.soundEnabled,
    toggleSound,
    playSound,
  };
};
