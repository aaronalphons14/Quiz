/*
  # Create Quiz Application Schema

  1. New Tables
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `question` (text, the question text)
      - `options` (jsonb, array of answer options)
      - `correct_answer` (text, the correct answer)
      - `explanation` (text, explanation shown after answering)
      - `difficulty` (text, easy/medium/hard)
      - `category` (text, question category)
      - `order_index` (integer, for ordering questions)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `quiz_questions` table
    - Add policy for public read access (quiz is public)

  3. Notes
    - Questions are publicly readable for anyone to take the quiz
    - No authentication required for this quiz application
*/

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty text DEFAULT 'medium',
  category text DEFAULT 'general',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (true);

-- Create index for ordering questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(order_index);