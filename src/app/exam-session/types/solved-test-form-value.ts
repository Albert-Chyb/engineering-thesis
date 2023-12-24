import { SolvedTestSchema } from '@tests-grading/types/solved-test';
import { z } from 'zod';
import { QuestionsAnswerSchema } from './user-answers';

export const SolvedTestFormValueSchema = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  answers: QuestionsAnswerSchema,
});

export type SolvedTestFormValue = z.infer<typeof SolvedTestFormValueSchema>;
