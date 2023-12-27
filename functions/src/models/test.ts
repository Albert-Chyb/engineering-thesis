import { z } from 'zod';
import { AllQuestionsTypes } from '../constants/questions-types';

export const testAnswerSchema = z.object({
  content: z.string(),
  position: z.number(),
});

export const testQuestionsTypesSchema = z.enum(AllQuestionsTypes);

export const testQuestionSchema = z.object({
  type: testQuestionsTypesSchema,
  position: z.number(),
  content: z.string(),
});

export const testSchema = z.object({
  name: z.string(),
});

export type TestAnswer = z.infer<typeof testAnswerSchema>;
export type TestQuestion = z.infer<typeof testQuestionSchema>;
export type Test = z.infer<typeof testSchema>;
export type QuestionsTypes = z.infer<typeof testQuestionsTypesSchema>;
