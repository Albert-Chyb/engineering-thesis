import { SolvedTestSchema } from '@utils/firestore/models/solved-tests.model';
import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { z } from 'zod';

export const SolvedTestFormValueSchema = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  answers: UserAnswersSchema,
});

export type SolvedTestFormValue = z.infer<typeof SolvedTestFormValueSchema>;
