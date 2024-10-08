import { z } from 'zod';
import { UserAnswersSchema } from './user-answers.model';

export const SolvedTestAnswerRecordValueSchema = z.object({
  isCorrect: z.boolean().nullable(),
  answer: UserAnswersSchema.valueSchema,
});

export const SolvedTestAnswerSchema = SolvedTestAnswerRecordValueSchema.extend({
  questionId: z.string(),
});

export const SolvedTestAnswersSchema = z.object({
  id: z.string(),
  answers: z.record(SolvedTestAnswerRecordValueSchema).transform((record) =>
    Object.entries(record).map(([questionId, questionAnswer]) =>
      SolvedTestAnswerSchema.parse({
        questionId: questionId,
        ...questionAnswer,
      }),
    ),
  ),
});

export type SolvedTestAnswers = z.infer<typeof SolvedTestAnswersSchema>;
export type SolvedTestAnswer = z.infer<typeof SolvedTestAnswerSchema>;
export type SolvedTestAnswerRecordValue = z.infer<
  typeof SolvedTestAnswerRecordValueSchema
>;
