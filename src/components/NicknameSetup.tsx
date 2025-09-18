import React, { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface NicknameSetupProps {
  onUserCreated: (user: { id: string; nickname: string }) => void;
}

export const NicknameSetup: React.FC<NicknameSetupProps> = ({ onUserCreated }) => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const createUserMutation = api.user.getOrCreate.useMutation({
    onSuccess: (user) => {
      onUserCreated(user);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.trim().length < 1) {
      setError("Введите никнейм");
      return;
    }

    if (nickname.trim().length > 20) {
      setError("Никнейм слишком длинный");
      return;
    }

    setError("");
    createUserMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="card-glass p-8 text-center">
          {/* Game Logo */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold font-comfortaa text-white mb-2">
              🎯 Play Sib v2
            </h1>
            <p className="text-white/80 text-lg">
              Сибирская викторина
            </p>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Добро пожаловать!
            </h2>
            <p className="text-white/80">
              Проверьте свои знания о торговой истории Томска
            </p>
          </motion.div>

          {/* Nickname Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Введите ваш никнейм..."
                className="w-full px-6 py-4 text-lg font-medium bg-white/90 backdrop-blur-sm rounded-full text-gray-800 placeholder-gray-500 border-2 border-transparent focus:border-primary-400 focus:outline-none transition-all duration-200"
                maxLength={20}
                autoFocus
                disabled={createUserMutation.isLoading}
              />
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-200 text-sm mt-2"
                >
                  ❌ {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={createUserMutation.isLoading || !nickname.trim()}
              className="w-full btn-primary text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {createUserMutation.isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                "🚀 А Играть!"
              )}
            </motion.button>
          </motion.form>

          {/* Game Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 space-y-3 text-white/70 text-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>⏰</span>
              <span>5 минут игры</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>❓</span>
              <span>20 секунд на вопрос</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🎯</span>
              <span>10 очков за правильный ответ</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
