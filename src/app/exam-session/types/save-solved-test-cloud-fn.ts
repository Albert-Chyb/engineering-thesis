import { SolvedTestSchema } from '@tests-grading/types/solved-test';
import { z } from 'zod';
import { QuestionsAnswerSchema } from './user-answers';

export const saveSolvedTestCloudFnDataSchema = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  sharedTestId: SolvedTestSchema.shape.sharedTest.shape.id,
  answers: QuestionsAnswerSchema,
});

export type SaveSolvedTestCloudFnData = z.infer<
  typeof saveSolvedTestCloudFnDataSchema
>;
