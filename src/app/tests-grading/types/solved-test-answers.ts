import { QuestionsAnswerSchema } from '@exam-session/types/user-answers';
import { QuestionsTypesEnum } from '@test-creator/types/question';
import { z } from 'zod';

export const SolvedTestAnswerSchema = z.object({
  isCorrect: z.boolean().nullable(),
  answer: QuestionsAnswerSchema.valueSchema,
  questionType: QuestionsTypesEnum,
});

export const SolvedTestAnswersSchema = z.object({
  id: z.string(),
  answers: z.record(SolvedTestAnswerSchema).transform((record) =>
    Object.entries(record).map(([key, value]) => ({
      questionId: key,
      ...value,
    })),
  ),
});

export type SolvedTestAnswers = z.infer<typeof SolvedTestAnswersSchema>;
export type SolvedTestAnswer = z.infer<typeof SolvedTestAnswerSchema>;
