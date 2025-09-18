import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  category: string;
  text: string;
  options: string[];
  answer: string;
}

interface QuestionCardProps {
  question: Question;
  timeRemaining: number;
  onAnswerSelected: (answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  timeRemaining,
  onAnswerSelected,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setShowResult(false);
  }, [question.id]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    // Notify parent component after a delay to show the result
    setTimeout(() => {
      onAnswerSelected(answer);
    }, 1500);
  };

  const getTimerColor = () => {
    if (timeRemaining <= 5) return "from-red-500 to-red-600";
    if (timeRemaining <= 10) return "from-orange-500 to-orange-600";
    return "from-primary-400 to-primary-500";
  };

  const getButtonClass = (option: string) => {
    if (!showResult) {
      return "bg-white/90 hover:bg-white text-gray-800 hover:scale-105 border-2 border-transparent hover:border-primary-400";
    }

    if (option === question.answer) {
      return "bg-green-500 text-white border-2 border-green-400 scale-105";
    }

    if (option === selectedAnswer && option !== question.answer) {
      return "bg-red-500 text-white border-2 border-red-400";
    }

    return "bg-white/50 text-gray-600 border-2 border-transparent";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-glass p-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-coral"></div>

      {/* Timer Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="absolute top-6 right-6"
      >
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-white/20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              d="M18 2.5a15.5 15.5 0 0 1 0 31 15.5 15.5 0 0 1 0-31"
            />
            {/* Progress circle */}
            <motion.path
              className={`bg-gradient-to-r ${getTimerColor()}`}
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(timeRemaining / 20) * 97.4}, 97.4`}
              d="M18 2.5a15.5 15.5 0 0 1 0 31 15.5 15.5 0 0 1 0-31"
              initial={{ strokeDasharray: "97.4, 97.4" }}
              animate={{ strokeDasharray: `${(timeRemaining / 20) * 97.4}, 97.4` }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={timeRemaining <= 5 ? "#ef4444" : timeRemaining <= 10 ? "#f97316" : "#2dd4bf"} />
                <stop offset="100%" stopColor={timeRemaining <= 5 ? "#dc2626" : timeRemaining <= 10 ? "#ea580c" : "#14b8a6"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${
              timeRemaining <= 5 ? 'text-red-300' : 
              timeRemaining <= 10 ? 'text-orange-300' : 
              'text-white'
            }`}>
              {timeRemaining}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Category Badge */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-400 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6"
      >
        <span>📚</span>
        <span>{question.category}</span>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 pr-20"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-relaxed">
          {question.text}
        </h2>
      </motion.div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => {
          const letters = ['А', 'Б', 'В', 'Г'];
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              onClick={() => handleAnswerClick(option)}
              disabled={showResult}
              className={`${getButtonClass(option)} p-4 rounded-2xl font-medium text-left transition-all duration-300 min-h-[80px] flex items-center space-x-4 touch-manipulation`}
              whileHover={!showResult ? { y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                showResult && option === question.answer 
                  ? 'bg-white/20 text-white' 
                  : showResult && option === selectedAnswer 
                  ? 'bg-white/20 text-white'
                  : 'bg-primary-500 text-white'
              }`}>
                {letters[index]}
              </div>
              
              <div className="flex-1 leading-relaxed">
                {option}
              </div>

              {showResult && option === question.answer && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl"
                >
                  ✅
                </motion.div>
              )}

              {showResult && option === selectedAnswer && option !== question.answer && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl"
                >
                  ❌
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {selectedAnswer === question.answer ? (
              <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-6 py-4 rounded-2xl">
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-bold text-lg">Правильно! +10 очков</div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-6 py-4 rounded-2xl">
                <div className="text-2xl mb-2">😞</div>
                <div className="font-bold text-lg">Неправильно</div>
                <div className="text-sm mt-2 opacity-80">
                  Правильный ответ: {question.answer}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
