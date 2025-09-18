import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

type QuestionStatus = "PENDING" | "APPROVED" | "REJECTED";

interface SubmittedQuestion {
  id: string;
  text: string;
  category: string;
  options: string;
  answer: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminPage: NextPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<QuestionStatus | "ALL">("PENDING");
  const [selectedQuestion, setSelectedQuestion] = useState<SubmittedQuestion | null>(null);

  // API queries
  const { data: questions, isLoading, refetch } = api.question.getSubmitted.useQuery(
    selectedStatus === "ALL" ? {} : { status: selectedStatus }
  );

  const approveQuestionMutation = api.question.approveSubmitted.useMutation({
    onSuccess: () => {
      void refetch();
      setSelectedQuestion(null);
    }
  });

  const rejectQuestionMutation = api.question.rejectSubmitted.useMutation({
    onSuccess: () => {
      void refetch();
      setSelectedQuestion(null);
    }
  });

  const handleApprove = async (questionId: string) => {
    try {
      await approveQuestionMutation.mutateAsync({ id: questionId });
    } catch (error) {
      console.error("Error approving question:", error);
    }
  };

  const handleReject = async (questionId: string) => {
    try {
      await rejectQuestionMutation.mutateAsync({ id: questionId });
    } catch (error) {
      console.error("Error rejecting question:", error);
    }
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      case "APPROVED":
        return "bg-green-500/20 text-green-300 border-green-500/50";
      case "REJECTED":
        return "bg-red-500/20 text-red-300 border-red-500/50";
    }
  };

  const getStatusEmoji = (status: QuestionStatus) => {
    switch (status) {
      case "PENDING": return "⏳";
      case "APPROVED": return "✅";
      case "REJECTED": return "❌";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-coral flex items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="ml-4 text-white text-xl">Cargando preguntas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-coral">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-comfortaa">
                🛠️ Panel de Administración
              </h1>
              <p className="text-white/80 mt-2">
                Gestiona las preguntas enviadas por los usuarios
              </p>
            </div>
            
            <Link href="/">
              <motion.button
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                          border border-white/30 rounded-xl text-white font-bold transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🏠</span>
                <span>Volver al Menú</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <motion.button
                key={status}
                onClick={() => setSelectedStatus(status as QuestionStatus | "ALL")}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  selectedStatus === status
                    ? "bg-white text-primary-600 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === "ALL" ? "🔍 Todas" : `${getStatusEmoji(status as QuestionStatus)} ${status}`}
                {questions && (
                  <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                    {status === "ALL" 
                      ? questions.length 
                      : questions.filter(q => q.status === status).length
                    }
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questions?.map((question) => (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedQuestion(question)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Status Badge */}
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-bold mb-4 ${getStatusColor(question.status as QuestionStatus)}`}>
                <span>{getStatusEmoji(question.status as QuestionStatus)}</span>
                <span>{question.status}</span>
              </div>

              {/* Category */}
              <div className="text-accent-yellow font-bold text-sm mb-2">
                📚 {question.category}
              </div>

              {/* Question Text */}
              <h3 className="text-white font-bold text-lg mb-3 line-clamp-3">
                {question.text}
              </h3>

              {/* Options Preview */}
              <div className="space-y-1 mb-4">
                {JSON.parse(question.options).slice(0, 2).map((option: string, index: number) => (
                  <div key={index} className="text-white/70 text-sm truncate">
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))}
                {JSON.parse(question.options).length > 2 && (
                  <div className="text-white/50 text-sm">
                    +{JSON.parse(question.options).length - 2} más...
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="text-white/50 text-xs">
                📅 {new Date(question.createdAt).toLocaleDateString('es-ES')}
              </div>
            </motion.div>
          ))}
        </div>

        {questions?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No hay preguntas {selectedStatus === "ALL" ? "" : selectedStatus.toLowerCase()}
            </h3>
            <p className="text-white/80">
              {selectedStatus === "PENDING" 
                ? "No hay preguntas pendientes de revisión."
                : "Cambia el filtro para ver preguntas en otros estados."
              }
            </p>
          </div>
        )}
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border font-bold ${getStatusColor(selectedQuestion.status as QuestionStatus)}`}>
                  <span className="text-xl">{getStatusEmoji(selectedQuestion.status as QuestionStatus)}</span>
                  <span>{selectedQuestion.status}</span>
                </div>
                
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Category */}
              <div className="text-accent-yellow font-bold mb-2">
                📚 {selectedQuestion.category}
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedQuestion.text}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-white">Opciones:</h3>
                {JSON.parse(selectedQuestion.options).map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      option === selectedQuestion.answer
                        ? "bg-green-500/20 border-green-500/50 text-green-300"
                        : "bg-white/5 border-white/20 text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                      {option === selectedQuestion.answer && (
                        <span className="text-green-400 text-lg">✅</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Answer */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Respuesta correcta:</h3>
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-300 font-bold">
                  ✅ {selectedQuestion.answer}
                </div>
              </div>

              {/* Date */}
              <div className="text-white/60 text-sm mb-6">
                📅 Enviada el {new Date(selectedQuestion.createdAt).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Actions */}
              {selectedQuestion.status === "PENDING" && (
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => handleApprove(selectedQuestion.id)}
                    disabled={approveQuestionMutation.isLoading}
                    className="flex-1 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 
                              border border-green-500/50 rounded-xl text-green-300 font-bold
                              transition-all duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {approveQuestionMutation.isLoading ? "Aprobando..." : "✅ Aprobar"}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleReject(selectedQuestion.id)}
                    disabled={rejectQuestionMutation.isLoading}
                    className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 
                              border border-red-500/50 rounded-xl text-red-300 font-bold
                              transition-all duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {rejectQuestionMutation.isLoading ? "Rechazando..." : "❌ Rechazar"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
