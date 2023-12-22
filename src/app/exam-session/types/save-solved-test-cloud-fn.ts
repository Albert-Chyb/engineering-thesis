import { z } from 'zod';
import { SolvedTestSchema } from './solved-test';

export const saveSolvedTestCloudFnDataSchema = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  sharedTestId: SolvedTestSchema.shape.sharedTest.shape.id,
  answers: SolvedTestSchema.shape.answers,
});

export type SaveSolvedTestCloudFnData = z.infer<
  typeof saveSolvedTestCloudFnDataSchema
>;
