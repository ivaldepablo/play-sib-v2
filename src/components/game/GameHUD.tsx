import React from "react";
import { motion } from "framer-motion";

interface GameHUDProps {
  nickname: string;
  score: number;
  gameTime: string;
  questionTime?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ 
  nickname, 
  score, 
  gameTime, 
  questionTime 
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
