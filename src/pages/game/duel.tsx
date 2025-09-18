import { type NextPage } from "next";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { localStorage } from "~/utils/localStorage";

const DuelPage: NextPage = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ userId: string; nickname: string } | null>(null);

  useEffect(() => {
    const session = localStorage.getUserSession();
    if (!session) {
      void router.push('/');
      return;
    }
    setUserSession(session);
  }, [router]);

  const handleBackToMenu = () => {
    void router.push('/');
  };

  if (!userSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-coral flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-coral flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/10 rounded-full"
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
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-12 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            className="text-8xl mb-6"
          >
            ⚔️
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold font-comfortaa text-white mb-4"
          >
            Режим Дуэли
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-6xl mb-6"
          >
            🚧
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl text-white/90 mb-8 leading-relaxed"
          >
            Режим дуэли в реальном времени скоро будет доступен!<br />
            Пока что наслаждайтесь одиночной игрой с новой<br />
            <span className="text-accent-yellow font-bold">премиальной рулеткой</span> 🎡
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-4"
          >
            <motion.button
              onClick={handleBackToMenu}
              className="btn-primary text-lg px-8 py-4 min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Главное меню
            </motion.button>
          </motion.div>

          {/* Coming Soon Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">🎯 Скоро появится:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Игра в реальном времени</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Соревновательные рейтинги</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>Чат с соперниками</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🎊</span>
                <span>Турниры и награды</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DuelPage;
