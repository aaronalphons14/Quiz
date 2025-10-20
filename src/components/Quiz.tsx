import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { QuizQuestion, UserAnswer } from '../types/quiz';
import { fetchQuizQuestions } from '../services/quizServices';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { ResultsSummary } from './ResultsSummary';

export const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!showFeedback) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, currentQuestionIndex, questions.length]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizQuestions();
      if (data.length === 0) {
        setError('No quiz questions available. Please add questions to the database.');
      } else {
        setQuestions(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    const newAnswer: UserAnswer = {
      questionId: questions[currentQuestionIndex].id,
      selectedAnswer: answer,
      isCorrect,
    };

    setUserAnswers([...userAnswers, newAnswer]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
    setIsQuizComplete(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#EC265F]" />
          <p className="text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-800 font-semibold mb-2">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <ResultsSummary
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />

        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
          selectedAnswer={userAnswers[currentQuestionIndex]?.selectedAnswer || null}
        />

        {showFeedback && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-[#EC265F] hover:bg-[#d61e50] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#EC265F]/30"
              aria-label={currentQuestionIndex < questions.length - 1 ? 'Next question' : 'View results'}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Press Enter, Space, or Arrow Right to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
