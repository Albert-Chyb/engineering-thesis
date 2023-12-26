import { QuestionsAnswerSchema } from '@exam-session/types/user-answers';
import { z } from 'zod';

export const AnswersKeysSchema = QuestionsAnswerSchema;

export type AnswersKeys = z.infer<typeof AnswersKeysSchema>;
