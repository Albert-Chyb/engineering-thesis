import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { z } from 'zod';
import { CloudFunctionDefinition } from '../types/functions-definitions';

export const SAVE_ANSWERS_KEYS_CLOUD_FN_DATA_SCHEMA = z.object({
  answersKeys: UserAnswersSchema,
  sharedTestId: z.string(),
});

export const SAVE_ANSWERS_KEYS_CLOUD_FN_RESULT_SCHEMA = z.union([
  z.null(),
  z.undefined(),
]);

export const SAVE_ANSWERS_KEYS_CLOUD_FN_DEFINITION: CloudFunctionDefinition<'saveAnswersKeys'> =
  {
    dataSchema: SAVE_ANSWERS_KEYS_CLOUD_FN_DATA_SCHEMA,
    resultSchema: SAVE_ANSWERS_KEYS_CLOUD_FN_RESULT_SCHEMA,
  };

export type SaveAnswersKeyCloudFnData = z.infer<
  typeof SAVE_ANSWERS_KEYS_CLOUD_FN_DATA_SCHEMA
>;
export type SaveAnswersKeyCloudFnResult = z.infer<
  typeof SAVE_ANSWERS_KEYS_CLOUD_FN_RESULT_SCHEMA
>;
