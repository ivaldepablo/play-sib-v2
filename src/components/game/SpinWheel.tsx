import React from "react";
import { motion } from "framer-motion";
import { playSound } from "~/utils/sounds";
import SpinningWheel from "./SpinningWheel";

interface SpinWheelProps {
  categories: string[];
  onCategorySelected: (category: string) => void;
  isSpinning: boolean;
}

// Mapeo de categorías rusas a IDs en inglés
const CATEGORY_MAPPING: Record<string, string> = {
  "Жизнь социальных классов": "social-classes",
  "Домашнее хозяйство": "domestic-economy", 
  "Знаменитые купеческие династии": "merchant-dynasties",
  "Томск - крупный сибирский торговый центр": "tomsk",
  "Развитие предпринимательства": "entrepreneurship"
};

// Mapeo inverso para encontrar categoría rusa por ID
const ID_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAPPING).map(([k, v]) => [v, k])
);

export const SpinWheel: React.FC<SpinWheelProps> = ({ 
  categories, 
  onCategorySelected, 
  isSpinning 
}) => {
  
  const handleSpinComplete = (winningSegment: any) => {
    playSound.correct();
    
    // Encontrar la categoría rusa correspondiente
    const russianCategory = ID_TO_CATEGORY[winningSegment.id];
    
    if (russianCategory && categories.includes(russianCategory)) {
      onCategorySelected(russianCategory);
    } else {
      // Fallback a la primera categoría disponible
      onCategorySelected(categories[0] || "Жизнь социальных классов");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Título */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold font-comfortaa text-white mb-4">
          Крутите колесо фортуны! 🎡
        </h2>
        <p className="text-white/80 text-lg">
          Выберите категорию для вопроса
        </p>
      </motion.div>

      {/* Rueda Giratoria de Alta Calidad */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative"
      >
        <SpinningWheel
          onSpinComplete={handleSpinComplete}
          disabled={isSpinning}
        />
      </motion.div>

      {/* Instrucciones */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        {isSpinning ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent-yellow text-lg font-bold animate-pulse"
          >
            Крутится... 🌀
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 text-lg"
          >
            Нажмите на кнопку "GIRAR" в центре колеса!
          </motion.p>
        )}
      </motion.div>

      {/* Efectos de partículas de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};
