import { z } from 'zod';

export const solvedTestAnswerSchema = z.object({
  answer: z.union([z.string(), z.array(z.string()), z.null()]),
  isCorrect: z.boolean().nullable(),
});

export const solvedTestAnswersSchema = z.object({
  answers: z.record(solvedTestAnswerSchema),
});

export type SolvedTestAnswers = z.infer<typeof solvedTestAnswersSchema>;

export type SolvedTestAnswer = z.infer<typeof solvedTestAnswerSchema>;
