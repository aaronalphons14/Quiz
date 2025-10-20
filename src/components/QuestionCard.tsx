import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { QuizQuestion } from '../types/quiz';

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  showFeedback: boolean;
  selectedAnswer: string | null;
}

export const QuestionCard = ({ question, onAnswer, showFeedback, selectedAnswer }: QuestionCardProps) => {
  const [localSelected, setLocalSelected] = useState<string | null>(selectedAnswer);

  useEffect(() => {
    setLocalSelected(selectedAnswer);
  }, [selectedAnswer]);

  const handleOptionClick = (option: string) => {
    if (showFeedback) return;

    setLocalSelected(option);
    const isCorrect = option === question.correct_answer;
    onAnswer(option, isCorrect);
  };

  const handleKeyPress = (e: React.KeyboardEvent, option: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(option);
    }
  };

  const getOptionStyles = (option: string) => {
    const baseStyles = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#26ECB4]/30";

    if (!showFeedback) {
      if (localSelected === option) {
        return `${baseStyles} bg-[#EC265F] text-white border-[#EC265F] hover:bg-[#d61e50]`;
      }
      return `${baseStyles} bg-white border-gray-300 hover:border-[#EC265F] hover:bg-gray-50`;
    }

    if (option === question.correct_answer) {
      return `${baseStyles} bg-green-50 border-green-500 text-green-900`;
    }

    if (localSelected === option && option !== question.correct_answer) {
      return `${baseStyles} bg-red-50 border-red-500 text-red-900`;
    }

    return `${baseStyles} bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed`;
  };

  const getOptionIcon = (option: string) => {
    if (!showFeedback) return null;

    if (option === question.correct_answer) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }

    if (localSelected === option && option !== question.correct_answer) {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }

    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          {question.question}
        </h2>

        <div className="space-y-4">
        {question.options.map((option: string, index: number) => (
            <button
                key={index}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handleKeyPress(e, option)}
                className={getOptionStyles(option)}
                disabled={showFeedback}
                aria-label={`Option ${index + 1}: ${option}`}
                aria-pressed={localSelected === option}
                tabIndex={0}
            >
                <div className="flex items-center justify-between gap-4">
                    <span className="text-base md:text-lg font-medium flex-1">
                        {option}
                    </span>
                    {getOptionIcon(option)}
                </div>
            </button>
        ))}
        </div>

        {showFeedback && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              localSelected === question.correct_answer
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              {localSelected === question.correct_answer ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div>
                <p className={`font-bold text-lg mb-2 ${
                  localSelected === question.correct_answer ? 'text-green-900' : 'text-red-900'
                }`}>
                  {localSelected === question.correct_answer ? 'Correct!' : 'Incorrect'}
                </p>
                <p className={`text-base ${
                  localSelected === question.correct_answer ? 'text-green-800' : 'text-red-800'
                }`}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
