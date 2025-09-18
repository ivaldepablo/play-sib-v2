import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "~/utils/api";
import { localStorage } from "~/utils/localStorage";
import { NicknameSetup } from "~/components/NicknameSetup";
import { MainMenu } from "~/components/MainMenu";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

const Home: NextPage = () => {
  const [userSession, setUserSession] = useState<{ userId: string; nickname: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNicknameSetup, setShowNicknameSetup] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const session = localStorage.getUserSession();
    if (session) {
      setUserSession({ userId: session.userId, nickname: session.nickname });
    } else {
      setShowNicknameSetup(true);
    }
    setIsLoading(false);
  }, []);

  const handleUserCreated = (user: { id: string; nickname: string }) => {
    const session = {
      userId: user.id,
      nickname: user.nickname,
      lastLogin: new Date().toISOString(),
    };
    
    localStorage.setUserSession(session);
    setUserSession({ userId: user.id, nickname: user.nickname });
    setShowNicknameSetup(false);
  };

  const handleLogout = () => {
    localStorage.clearUserSession();
    setUserSession(null);
    setShowNicknameSetup(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <AnimatePresence mode="wait">
        {showNicknameSetup ? (
          <motion.div
            key="nickname-setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <NicknameSetup onUserCreated={handleUserCreated} />
          </motion.div>
        ) : userSession ? (
          <motion.div
            key="main-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MainMenu 
              userSession={userSession} 
              onLogout={handleLogout}
            />
          </motion.div>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
