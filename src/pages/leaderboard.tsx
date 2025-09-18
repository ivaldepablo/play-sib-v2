import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";

import { api } from "~/utils/api";
import { localStorage } from "~/utils/localStorage";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

type TabType = "global" | "weekly";

const LeaderboardPage: NextPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("global");
  const [userSession, setUserSession] = useState<{ userId: string; nickname: string } | null>(null);

  // Check user session
  useEffect(() => {
    const session = localStorage.getUserSession();
    if (!session) {
      router.push('/');
      return;
    }
    setUserSession(session);
  }, [router]);

  // API queries
  const { data: globalLeaderboard, isLoading: globalLoading } = api.leaderboard.getGlobal.useQuery({ 
    limit: 50 
  });

  const { data: weeklyLeaderboard, isLoading: weeklyLoading } = api.leaderboard.getWeekly.useQuery({ 
    limit: 50 
  });

  const { data: userRank } = api.leaderboard.getUserRank.useQuery(
    { userId: userSession?.userId ?? "" },
    { enabled: !!userSession }
  );

  const { data: aroundUser } = api.leaderboard.getAroundUser.useQuery(
    { userId: userSession?.userId ?? "", range: 3 },
    { enabled: !!userSession }
  );

  if (!userSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const currentData = activeTab === "global" ? globalLeaderboard : weeklyLeaderboard;
  const isLoading = activeTab === "global" ? globalLoading : weeklyLoading;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-comfortaa text-white mb-2">
            🏆 Таблица лидеров
          </h1>
          <p className="text-white/80 text-lg">
            Лучшие игроки Play Sib v2
          </p>
        </motion.div>

        {/* User Stats Card */}
        {userRank && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              📊 Ваша статистика
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-300">
                  #{userRank.globalRank}
                </div>
                <div className="text-white/70 text-sm">Глобальный рейтинг</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-yellow">
                  {userRank.globalScore}
                </div>
                <div className="text-white/70 text-sm">Лучший результат</div>
              </div>
              {userRank.weeklyRank && (
                <>
                  <div>
                    <div className="text-2xl font-bold text-accent-green">
                      #{userRank.weeklyRank}
                    </div>
                    <div className="text-white/70 text-sm">Недельный рейтинг</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-coral">
                      {userRank.weeklyScore}
                    </div>
                    <div className="text-white/70 text-sm">Лучший за неделю</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-full p-1 mb-8"
        >
          {[
            { key: "global" as const, label: "🌍 Все время", icon: "🏆" },
            { key: "weekly" as const, label: "📅 Эта неделя", icon: "⚡" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-white text-primary-600 shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-glass p-6 mb-8"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentData && currentData.length > 0 ? (
                  <div className="space-y-2">
                    {currentData.slice(0, 10).map((player, index) => {
                      const isCurrentUser = userSession && 
                        ('id' in player ? player.id === userSession.userId : false);
                      
                      return (
                        <motion.div
                          key={player.nickname}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                            isCurrentUser 
                              ? 'bg-primary-500/20 border-2 border-primary-400' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              index === 0 ? 'bg-yellow-500 text-yellow-900' :
                              index === 1 ? 'bg-gray-400 text-gray-900' :
                              index === 2 ? 'bg-orange-600 text-orange-100' :
                              'bg-white/20 text-white'
                            }`}>
                              {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                            </div>
                            
                            <div>
                              <div className={`font-bold ${
                                isCurrentUser ? 'text-primary-200' : 'text-white'
                              }`}>
                                {player.nickname}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                                    Вы
                                  </span>
                                )}
                              </div>
                              {activeTab === "weekly" && "date" in player && (
                                <div className="text-white/60 text-sm">
                                  {new Date(player.date).toLocaleDateString('ru-RU')}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className={`font-bold text-xl ${
                            isCurrentUser ? 'text-primary-200' : 'text-white'
                          }`}>
                            {'highScore' in player ? player.highScore : player.score} очков
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-white/70">
                    <div className="text-4xl mb-4">📊</div>
                    <p>Пока нет данных для отображения</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center space-x-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
            >
              🏠 Главная
            </motion.button>
          </Link>
          
          <Link href="/game/single">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              🎯 Играть
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
