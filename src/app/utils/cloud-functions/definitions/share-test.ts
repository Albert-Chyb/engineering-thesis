import { z } from 'zod';
import { CloudFunctionDefinition } from '../types/functions-definitions';

export const SHARE_TEST_CLOUD_FN_DATA_SCHEMA = z.object({
  testId: z.string(),
  name: z.string(),
});

export const SHARE_TEST_CLOUD_FN_RESULT_SCHEMA = z.string();

export const SHARE_TEST_CLOUD_FN_DEFINITION: CloudFunctionDefinition<'shareTest'> =
  {
    dataSchema: SHARE_TEST_CLOUD_FN_DATA_SCHEMA,
    resultSchema: SHARE_TEST_CLOUD_FN_RESULT_SCHEMA,
  };

export type ShareTestCloudFnData = z.infer<
  typeof SHARE_TEST_CLOUD_FN_DATA_SCHEMA
>;
export type ShareTestCloudFnResult = z.infer<
  typeof SHARE_TEST_CLOUD_FN_RESULT_SCHEMA
>;
