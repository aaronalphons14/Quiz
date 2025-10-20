import { supabase } from '../lib/supabase';
import type{ QuizQuestion } from '../types/quiz.ts';

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch quiz questions: ${error.message}`);
  }

  return data || [];
};
