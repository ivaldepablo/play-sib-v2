import React from "react";
import { motion } from "framer-motion";
import { useSounds } from "~/utils/sounds";

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = "" }) => {
  const { soundEnabled, toggleSound } = useSounds();

  return (
    <motion.button
      onClick={toggleSound}
      className={`flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={soundEnabled ? "Выключить звуки" : "Включить звуки"}
    >
      <motion.span
        initial={false}
        animate={{ scale: soundEnabled ? 1 : 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-xl"
      >
        {soundEnabled ? "🔊" : "🔇"}
      </motion.span>
      
      <span className="text-white text-sm font-medium">
        {soundEnabled ? "Звук" : "Тихо"}
      </span>
      
      {/* Visual indicator */}
      <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
        soundEnabled ? "bg-green-400" : "bg-gray-400"
      }`} />
    </motion.button>
  );
};
