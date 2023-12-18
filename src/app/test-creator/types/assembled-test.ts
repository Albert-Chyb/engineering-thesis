import { z } from 'zod';
import { AnswerSchema } from './answer';
import { QuestionSchema } from './question';
import { TestSchema } from './test';

export const AssembledQuestionSchema = QuestionSchema.extend({
  answers: z.array(AnswerSchema),
});

export const AssembledTestSchema = TestSchema.extend({
  questions: z.array(AssembledQuestionSchema),
});

export type AssembledQuestion = z.infer<typeof AssembledQuestionSchema>;

export type AssembledTest = z.infer<typeof AssembledTestSchema>;
