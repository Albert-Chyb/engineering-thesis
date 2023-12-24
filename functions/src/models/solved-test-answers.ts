import { z } from 'zod';
import { AllQuestionsTypes } from '../constants/questions-types';

export const solvedTestAnswerSchema = z.object({
  answer: z.union([z.string(), z.array(z.string()), z.null()]),
  isCorrect: z.boolean().nullable(),
  questionType: z.enum(AllQuestionsTypes),
});

export const solvedTestAnswersSchema = z.object({
  answers: z.record(solvedTestAnswerSchema),
});

export type SolvedTestAnswers = z.infer<typeof solvedTestAnswersSchema>;

export type SolvedTestAnswer = z.infer<typeof solvedTestAnswerSchema>;
