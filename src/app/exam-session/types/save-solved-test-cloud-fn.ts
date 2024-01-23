import { SolvedTestSchema } from '@utils/firestore/models/solved-tests.model';
import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { z } from 'zod';

export const saveSolvedTestCloudFnDataSchema = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  sharedTestId: SolvedTestSchema.shape.sharedTestId,
  answers: UserAnswersSchema,
});

export type SaveSolvedTestCloudFnData = z.infer<
  typeof saveSolvedTestCloudFnDataSchema
>;
