import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api } from "~/utils/api";
import { playSound } from "~/utils/sounds";
import { SoundToggle } from "./ui/SoundToggle";

interface MainMenuProps {
  userSession: { userId: string; nickname: string };
  onLogout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ userSession, onLogout }) => {
  const { data: userProfile, isLoading } = api.user.getProfile.useQuery({
    userId: userSession.userId,
  });

  const menuItems = [
    {
      title: "🎯 Играть",
      description: "Одиночная игра",
      href: "/game/single",
      color: "from-primary-400 to-primary-500",
      delay: 0.1,
    },
    {
      title: "⚔️ Дуэль",
      description: "Игра 1 vs 1",
      href: "/game/duel",
      color: "from-accent-coral to-red-500",
      delay: 0.2,
    },
    {
      title: "🏆 Лидеры",
      description: "Таблица рекордов",
      href: "/leaderboard",
      color: "from-accent-yellow to-orange-500",
      delay: 0.3,
    },
    {
      title: "📝 Предложить вопрос",
      description: "Добавить новый вопрос",
      href: "/submit-question",
      color: "from-accent-green to-green-500",
      delay: 0.4,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold font-comfortaa text-white mb-4">
            🎯 Play Sib v2
          </h1>
          <p className="text-white/80 text-xl">
            Сибирская викторина
          </p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-glass p-6 mb-8 text-center"
        >
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded-full w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-white/20 rounded-full w-32 mx-auto"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">
                👤 {userProfile?.nickname}
              </h2>
              <p className="text-white/70 text-lg">
                🏆 Лучший результат: <span className="font-bold">{userProfile?.highScore ?? 0}</span> очков
              </p>
              <button
                onClick={onLogout}
                className="mt-4 text-white/60 hover:text-white/80 transition-colors duration-200 text-sm underline"
              >
                Сменить никнейм
              </button>
            </>
          )}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={item.href}>
                <div 
                  className={`card-glass p-6 hover:bg-white/30 transition-all duration-300 cursor-pointer group`}
                  onClick={() => playSound.click()}
                >
                  <div className={`w-full h-2 bg-gradient-to-r ${item.color} rounded-full mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sound Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <SoundToggle />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: "🎯", label: "5 категорий", value: "История Томска" },
            { icon: "⏰", label: "5 минут", value: "Время игры" },
            { icon: "❓", label: "20 секунд", value: "На вопрос" },
            { icon: "🏆", label: "10 очков", value: "За ответ" },
          ].map((stat, index) => (
            <div key={index} className="card-glass p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-white font-bold text-sm">{stat.label}</div>
              <div className="text-white/70 text-xs">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
