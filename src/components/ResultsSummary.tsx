import { Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import type { QuizQuestion, UserAnswer } from '../types/quiz';

interface ResultsSummaryProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

export const ResultsSummary = ({ questions, userAnswers, onRestart }: ResultsSummaryProps) => {
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect Score!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Try Again!";
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-[#26ECB4]";
    if (percentage >= 40) return "text-yellow-600";
    return "text-[#EC265F]";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <div className="text-center mb-8">
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${getScoreColor()}`} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {getScoreMessage()}
          </h1>
          <p className="text-5xl md:text-6xl font-bold mb-2" style={{ color: '#EC265F' }}>
            {percentage}%
          </p>
          <p className="text-xl text-gray-600">
            You got {correctCount} out of {totalQuestions} questions correct
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full md:w-auto mx-auto flex items-center justify-center gap-2 bg-[#EC265F] hover:bg-[#d61e50] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#EC265F]/30"
          aria-label="Restart quiz"
        >
          <RotateCcw className="w-5 h-5" />
          Restart Quiz
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Your Answers</h2>
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer?.isCorrect || false;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                isCorrect ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Question {index + 1}</p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    {question.question}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                        Your answer:
                      </span>
                      <span className={`text-sm font-semibold ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {userAnswer?.selectedAnswer || 'No answer'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                          Correct answer:
                        </span>
                        <span className="text-sm font-semibold text-green-700">
                          {question.correct_answer}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Explanation: </span>
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
