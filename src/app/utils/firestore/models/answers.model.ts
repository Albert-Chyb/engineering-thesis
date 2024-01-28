import { z } from 'zod';

export const RawAnswerSchema = z.object({
  content: z.string(),
  position: z.number().positive().int(),
  questionId: z.string(),
  testId: z.string(),
});

export const AnswerSchema = RawAnswerSchema.extend({
  id: z.string(),
});

export type Answer = z.infer<typeof AnswerSchema>;

export type RawAnswer = z.infer<typeof RawAnswerSchema>;
