import React from "react";
import { motion } from "framer-motion";

interface GameEndScreenProps {
  score: number;
  nickname: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({
  score,
  nickname,
  onRestart,
  onMainMenu,
}) => {
  const getScoreMessage = () => {
    if (score >= 100) return { 
      text: "Великолепно! Вы эксперт сибирской истории!", 
      emoji: "🏆",
      color: "from-yellow-400 to-yellow-500" 
    };
    if (score >= 70) return { 
      text: "Отлично! У вас хорошие знания!", 
      emoji: "🥇",
      color: "from-primary-400 to-primary-500" 
    };
    if (score >= 40) return { 
      text: "Хорошо! Есть что улучшить!", 
      emoji: "🥈",
      color: "from-gray-400 to-gray-500" 
    };
    if (score >= 20) return { 
      text: "Неплохо для начала!", 
      emoji: "🥉",
      color: "from-orange-400 to-orange-500" 
    };
    return { 
      text: "Не расстраивайтесь, попробуйте еще раз!", 
      emoji: "📚",
      color: "from-accent-coral to-red-500" 
    };
  };

  const scoreMessage = getScoreMessage();

  const handleShare = () => {
    const text = `Я набрал ${score} очков в игре Play Sib v2! Попробуй и ты проверить свои знания о сибирской истории!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Play Sib v2 - Сибирская викторина',
        text: text,
        url: window.location.origin,
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`)
        .then(() => alert('Ссылка скопирована в буфер обмена!'))
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card-glass p-8 max-w-2xl w-full text-center relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Game Over Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 mb-8"
        >
          <h1 className="text-4xl font-bold font-comfortaa text-white mb-2">
            ⏰ Время вышло!
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🎊
          </motion.div>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          className="relative z-10 mb-8"
        >
          <div className={`bg-gradient-to-r ${scoreMessage.color} p-8 rounded-3xl shadow-2xl mb-6`}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-4"
            >
              {scoreMessage.emoji}
            </motion.div>
            
            <div className="text-white">
              <p className="text-lg opacity-90 mb-2">Финальный счет</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-6xl font-bold mb-2 text-shadow-lg"
              >
                {score}
              </motion.div>
              <p className="text-xl opacity-90">очков</p>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 text-lg font-medium"
          >
            {scoreMessage.text}
          </motion.div>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 mb-8"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-white">{Math.floor(score / 10)}</div>
              <div className="text-white/70 text-sm">правильных ответов</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-white">5:00</div>
              <div className="text-white/70 text-sm">игрового времени</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={onRestart}
              className="flex-1 btn-primary text-lg py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Играть снова
            </motion.button>
            
            <motion.button
              onClick={onMainMenu}
              className="flex-1 btn-outline text-lg py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Главная
            </motion.button>
          </div>

          <motion.button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-accent-green to-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📤 Поделиться результатом
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 mt-8 pt-6 border-t border-white/20 text-white/60 text-sm"
        >
          <p className="font-bold text-primary-200 mb-2">Play Sib v2</p>
          <p>Викторина о торговой истории Томска</p>
          <p>Узнайте больше о купеческих династиях и развитии Сибири!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
