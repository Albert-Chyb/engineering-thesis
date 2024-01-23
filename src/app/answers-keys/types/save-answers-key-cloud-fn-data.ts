import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { z } from 'zod';

export const SaveAnswersKeyCloudFnDataSchema = z.object({
  answersKeys: UserAnswersSchema,
  sharedTestId: z.string(),
});

export type SaveAnswersKeyCloudFnData = z.infer<
  typeof SaveAnswersKeyCloudFnDataSchema
>;
