import { SolvedTestSchema } from '@utils/firestore/models/solved-tests.model';
import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { z } from 'zod';
import { CloudFunctionDefinition } from '../types/functions-definitions';

export const SAVE_SOLVED_TEST_CLOUD_FN_DATA_SCHEMA = z.object({
  testTakerName: SolvedTestSchema.shape.testTakerName,
  sharedTestId: SolvedTestSchema.shape.sharedTestId,
  answers: UserAnswersSchema,
});

export const SAVE_SOLVED_TEST_CLOUD_FN_RESULT_SCHEMA = z.string();

export const SAVE_SOLVED_TEST_CLOUD_FN_DEFINITION: CloudFunctionDefinition<'saveSolvedTest'> =
  {
    dataSchema: SAVE_SOLVED_TEST_CLOUD_FN_DATA_SCHEMA,
    resultSchema: SAVE_SOLVED_TEST_CLOUD_FN_RESULT_SCHEMA,
  };

export type SaveSolvedTestCloudFnData = z.infer<
  typeof SAVE_SOLVED_TEST_CLOUD_FN_DATA_SCHEMA
>;
export type SaveSolvedTestCloudFnResult = z.infer<
  typeof SAVE_SOLVED_TEST_CLOUD_FN_RESULT_SCHEMA
>;
