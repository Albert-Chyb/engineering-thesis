import { QuestionsAnswerSchema } from '@exam-session/types/user-answers';
import { z } from 'zod';

export const SaveAnswersKeyCloudFnDataSchema = z.object({
  answersKeys: QuestionsAnswerSchema,
  sharedTestId: z.string(),
});

export type SaveAnswersKeyCloudFnData = z.infer<
  typeof SaveAnswersKeyCloudFnDataSchema
>;
