import { QuestionsAnswerSchema } from '@exam-session/types/user-answers';
import { z } from 'zod';

export const SolvedTestAnswersSchema = z.object({
  id: z.string(),
  answers: z.record(
    z.object({
      isCorrect: z.boolean().nullable(),
      answer: QuestionsAnswerSchema.valueSchema,
    }),
  ),
});

export type SolvedTestAnswers = z.infer<typeof SolvedTestAnswersSchema>;
