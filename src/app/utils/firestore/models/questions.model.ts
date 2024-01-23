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
});

export const QuestionSchema = RawQuestionSchema.extend({
  id: z.string(),
});

export type RawQuestion = z.infer<typeof RawQuestionSchema>;

export type Question = z.infer<typeof QuestionSchema>;

export type QuestionsTypes = z.infer<typeof QuestionsTypesEnum>;

export type ClosedQuestionsTypes = Exclude<QuestionsTypes, 'text-answer'>;

export type OpenQuestionsTypes = Exclude<QuestionsTypes, ClosedQuestionsTypes>;
