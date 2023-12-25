import { QuestionsAnswerSchema } from '@exam-session/types/user-answers';
import { QuestionsTypesEnum } from '@test-creator/types/question';
import { z } from 'zod';

export const SolvedTestAnswerRecordValueSchema = z.object({
  isCorrect: z.boolean().nullable(),
  answer: QuestionsAnswerSchema.valueSchema,
  questionType: QuestionsTypesEnum,
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
