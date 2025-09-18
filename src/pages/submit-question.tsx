import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";

import { api } from "~/utils/api";
import { localStorage } from "~/utils/localStorage";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

// Категории из оригинальной игры
const CATEGORIES = [
  "Жизнь социальных классов",
  "Домашнее хозяйство", 
  "Знаменитые купеческие династии",
  "Томск - крупный сибирский торговый центр",
  "Развитие предпринимательства"
];

const SubmitQuestionPage: NextPage = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useState<{ userId: string; nickname: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    options: ['', '', '', ''],
    answer: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitQuestionMutation = api.question.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  // Check user session
  useEffect(() => {
    const session = localStorage.getUserSession();
    if (!session) {
      router.push('/');
      return;
    }
    setUserSession(session);
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.text.trim().length < 10) {
      newErrors.text = 'Вопрос должен содержать минимум 10 символов';
    }

    if (formData.text.trim().length > 500) {
      newErrors.text = 'Вопрос не должен превышать 500 символов';
    }

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    const filledOptions = formData.options.filter(opt => opt.trim().length > 0);
    if (filledOptions.length !== 4) {
      newErrors.options = 'Заполните все 4 варианта ответа';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Выберите правильный ответ';
    }

    if (formData.answer && !formData.options.includes(formData.answer)) {
      newErrors.answer = 'Правильный ответ должен быть одним из вариантов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    submitQuestionMutation.mutate({
      text: formData.text.trim(),
      category: formData.category,
      options: formData.options.map(opt => opt.trim()),
      answer: formData.answer.trim(),
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleAnswerSelect = (answer: string) => {
    setFormData(prev => ({ ...prev, answer }));
  };

  const resetForm = () => {
    setFormData({
      text: '',
      category: '',
      options: ['', '', '', ''],
      answer: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (!userSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="card-glass p-8 text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🎉
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Спасибо за вопрос!
            </h2>
            
            <p className="text-white/80 mb-8 leading-relaxed">
              Ваш вопрос отправлен на модерацию. После проверки он может появиться в игре!
            </p>
            
            <div className="space-y-4">
              <motion.button
                onClick={resetForm}
                className="w-full btn-primary py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ➕ Добавить еще вопрос
              </motion.button>
              
              <Link href="/">
                <motion.button
                  className="w-full btn-outline py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🏠 На главную
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
            📝 Предложить вопрос
          </h1>
          <p className="text-white/80 text-lg">
            Помогите улучшить игру, добавив свой вопрос!
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="card-glass p-8 space-y-8">
            {/* Question Text */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                🤔 Текст вопроса
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Введите ваш вопрос о торговой истории Томска..."
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl text-gray-800 placeholder-gray-500 border-2 border-transparent focus:border-primary-400 focus:outline-none transition-all duration-200 min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${errors.text ? 'text-red-200' : 'text-white/60'}`}>
                  {errors.text || `${formData.text.length}/500 символов`}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                📚 Категория
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category }))}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      formData.category === category
                        ? 'bg-primary-500 text-white border-2 border-primary-400'
                        : 'bg-white/10 hover:bg-white/20 text-white border-2 border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-sm leading-tight">
                      {category}
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-200 text-sm mt-2">❌ {errors.category}</p>
              )}
            </div>

            {/* Answer Options */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                📝 Варианты ответов
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.options.map((option, index) => {
                  const letters = ['А', 'Б', 'В', 'Г'];
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {letters[index]}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Вариант ${letters[index]}`}
                        className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl text-gray-800 placeholder-gray-500 border-2 border-transparent focus:border-primary-400 focus:outline-none transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          formData.answer === option
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-white/60 hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Выбрать как правильный ответ"
                      >
                        ✓
                      </motion.button>
                    </div>
                  );
                })}
              </div>
              {errors.options && (
                <p className="text-red-200 text-sm mt-2">❌ {errors.options}</p>
              )}
              {errors.answer && (
                <p className="text-red-200 text-sm mt-2">❌ {errors.answer}</p>
              )}
              <p className="text-white/60 text-sm mt-2">
                💡 Нажмите на ✓ рядом с правильным ответом
              </p>
            </div>

            {/* Correct Answer Display */}
            {formData.answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-400/50 rounded-xl p-4"
              >
                <div className="text-green-200 font-bold mb-1">
                  ✅ Правильный ответ:
                </div>
                <div className="text-white">{formData.answer}</div>
              </motion.div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400/50 rounded-xl p-4"
              >
                <div className="text-red-200">❌ {errors.submit}</div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={submitQuestionMutation.isLoading}
                className="flex-1 btn-primary text-lg py-4 min-h-[56px] flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitQuestionMutation.isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  '🚀 Отправить вопрос'
                )}
              </motion.button>

              <Link href="/">
                <motion.button
                  type="button"
                  className="flex-1 btn-outline text-lg py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Назад
                </motion.button>
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-glass p-6 mt-8"
        >
          <h3 className="text-white font-bold text-lg mb-4">
            📋 Рекомендации для вопросов
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>
              <p className="mb-2">✅ <strong>Хорошие вопросы:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• Основаны на исторических фактах</li>
                <li>• Имеют четкий и однозначный ответ</li>
                <li>• Интересны и познавательны</li>
                <li>• Соответствуют выбранной категории</li>
              </ul>
            </div>
            <div>
              <p className="mb-2">❌ <strong>Избегайте:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• Субъективных мнений</li>
                <li>• Слишком сложных вопросов</li>
                <li>• Повторения существующих вопросов</li>
                <li>• Орфографических ошибок</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitQuestionPage;
