import { type NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { localStorage } from "~/utils/localStorage";
import { SpinWheel } from "~/components/game/SpinWheel";
import { QuestionCard } from "~/components/game/QuestionCard";
import { GameHUD } from "~/components/game/GameHUD";
import { GameEndScreen } from "~/components/game/GameEndScreen";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

// Categories from the original game
const CATEGORIES = [
  "Жизнь социальных классов",
  "Домашнее хозяйство", 
  "Знаменитые купеческие династии",
  "Томск - крупный сибирский торговый центр",
  "Развитие предпринимательства"
];

interface GameQuestion {
  id: string;
  category: string;
  text: string;
  options: string[];
  answer: string;
}

const SinglePlayerGame: NextPage = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ userId: string; nickname: string } | null>(null);
  
  // Game state
  const [gameState, setGameState] = useState<'wheel' | 'question' | 'ended'>('wheel');
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(300); // 5 minutes
  const [questionTime, setQuestionTime] = useState(20);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);

  // API queries
  const { data: questions, isLoading: questionsLoading } = api.question.getByCategory.useQuery(
    { category: selectedCategory },
    { enabled: !!selectedCategory }
  );

  const submitScoreMutation = api.score.submit.useMutation();

  // Check user session
  useEffect(() => {
    const session = localStorage.getUserSession();
    if (!session) {
      router.push('/');
      return;
    }
    setUserSession(session);
  }, [router]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'wheel' && gameState !== 'question') return;
    
    const interval = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Question timer
  useEffect(() => {
    if (gameState !== 'question' || !currentQuestion) return;
    
    const interval = setInterval(() => {
      setQuestionTime(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, currentQuestion]);

  const handleCategorySelected = useCallback((category: string) => {
    setIsSpinning(true);
    setSelectedCategory(category);
    
    // Simulate wheel spin time
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  }, []);

  // Get random question when category is selected and questions are loaded
  useEffect(() => {
    if (questions && questions.length > 0 && !isSpinning && selectedCategory) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      if (randomQuestion) {
        setCurrentQuestion({
          id: randomQuestion.id,
          category: randomQuestion.category,
          text: randomQuestion.text,
          options: randomQuestion.options as string[],
          answer: randomQuestion.answer,
        });
        setGameState('question');
        setQuestionTime(20);
      }
    }
  }, [questions, isSpinning, selectedCategory]);

  const handleAnswerSelected = useCallback((selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    // Show result for 2 seconds, then return to wheel
    setTimeout(() => {
      setCurrentQuestion(null);
      setSelectedCategory('');
      setGameState('wheel');
    }, 2000);
  }, [currentQuestion]);

  const handleTimeUp = useCallback(() => {
    handleAnswerSelected(''); // Empty answer = incorrect
  }, [handleAnswerSelected]);

  const endGame = useCallback(() => {
    setGameState('ended');
    
    // Submit score to backend
    if (userSession) {
      submitScoreMutation.mutate({
        userId: userSession.userId,
        value: score,
        gameMode: 'SINGLE',
      });
    }
  }, [score, userSession, submitScoreMutation]);

  const restartGame = useCallback(() => {
    setScore(0);
    setGameTime(300);
    setQuestionTime(20);
    setCurrentQuestion(null);
    setSelectedCategory('');
    setGameState('wheel');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!userSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (questionsLoading && selectedCategory) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="ml-4 text-white text-xl">Загружаем вопросы...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {gameState === 'ended' ? (
          <GameEndScreen
            key="end-screen"
            score={score}
            nickname={userSession.nickname}
            onRestart={restartGame}
            onMainMenu={() => router.push('/')}
          />
        ) : (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Game HUD */}
            <GameHUD
              nickname={userSession.nickname}
              score={score}
              gameTime={formatTime(gameTime)}
              questionTime={currentQuestion ? questionTime : undefined}
            />

            {/* Game Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              {gameState === 'wheel' ? (
                <motion.div
                  key="wheel"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SpinWheel
                    categories={CATEGORIES}
                    onCategorySelected={handleCategorySelected}
                    isSpinning={isSpinning}
                  />
                </motion.div>
              ) : currentQuestion ? (
                <motion.div
                  key={`question-${currentQuestion.id}`}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-4xl"
                >
                  <QuestionCard
                    question={currentQuestion}
                    timeRemaining={questionTime}
                    onAnswerSelected={handleAnswerSelected}
                  />
                </motion.div>
              ) : (
                <LoadingSpinner size="large" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SinglePlayerGame;
