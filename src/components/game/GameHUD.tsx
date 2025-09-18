import React from "react";
import { motion } from "framer-motion";

interface GameHUDProps {
  nickname: string;
  score: number;
  gameTime: string;
  questionTime?: number;
  onBackToMenu?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ 
  nickname, 
  score, 
  gameTime, 
  questionTime,
  onBackToMenu 
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <div className="flex items-center space-x-4">
            {onBackToMenu && (
              <motion.button
                onClick={onBackToMenu}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                          border border-red-500/50 rounded-full transition-all duration-200 
                          hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🔙</span>
                <span className="text-white font-medium text-sm">Вернуться</span>
              </motion.button>
            )}
          </div>

          {/* Player Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👤</span>
              <span className="text-white font-bold text-lg">
                {nickname}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-white font-bold text-lg">
                {score} очков
              </span>
            </div>
          </div>

          {/* Timers */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-primary-500/20 px-4 py-2 rounded-full">
              <span className="text-xl">⏰</span>
              <span className="text-white font-bold text-lg">
                {gameTime}
              </span>
            </div>

            {questionTime !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  questionTime <= 5 
                    ? 'bg-red-500/30 animate-pulse' 
                    : questionTime <= 10 
                    ? 'bg-orange-500/30' 
                    : 'bg-accent-coral/20'
                }`}
              >
                <span className="text-xl">⏱️</span>
                <span className={`font-bold text-lg ${
                  questionTime <= 5 ? 'text-red-200' : 'text-white'
                }`}>
                  {questionTime}с
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
