import { z } from 'zod';

export const QuestionsTypesEnum = z.enum([
  'single-choice',
  'multi-choice',
  'text-answer',
]);

export const RawQuestionSchema = z.object({
  content: z.string(),
  position: z.number().positive().int(),
  type: QuestionsTypesEnum,
  testId: z.string(),
});

export const QuestionSchema = RawQuestionSchema.extend({
  id: z.string(),
});

export type QuestionsTypes = z.infer<typeof QuestionsTypesEnum>;

export type RawQuestion = z.infer<typeof RawQuestionSchema>;

export type Question<TQuestionType extends QuestionsTypes = QuestionsTypes> =
  z.infer<typeof QuestionSchema> & { type: TQuestionType };

export type ClosedQuestionsTypes = Exclude<QuestionsTypes, 'text-answer'>;

export type OpenQuestionsTypes = Exclude<QuestionsTypes, ClosedQuestionsTypes>;
