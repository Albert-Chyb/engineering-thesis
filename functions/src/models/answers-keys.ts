import { z } from 'zod';
import { ClosedQuestionsTypes } from '../constants/questions-types';
import { sharedTestSchema } from './shared-test';
import { solvedTestAnswerSchema } from './solved-test-answers';

export const answersKeysSchema = z
  .object({
    sharedTest: sharedTestSchema,
    answersKeys: z.record(solvedTestAnswerSchema.shape.answer),
  })
  .refine(
    (data) => {
      for (const questionId in data.answersKeys) {
        return (
          data.sharedTest.questions.findIndex(
            (question) => question.id === questionId,
          ) !== -1
        );
      }

      return true;
    },
    {
      message:
        'One of the answers keys does not match any question id in the shared test',
    },
  )
  .refine(
    (data) => {
      const closedQuestionsIds = data.sharedTest.questions
        .filter((question) =>
          ClosedQuestionsTypes.includes(question.type as any),
        )
        .map((q) => q.id);
      const answersKeysQuestionsIds = Object.keys(data.answersKeys);

      return answersKeysQuestionsIds.every((answersKeysQuestionsId) =>
        closedQuestionsIds.includes(answersKeysQuestionsId as any),
      );
    },
    { message: 'Answers keys can only be created to closed questions' },
  )
  .transform((data) => data.answersKeys);

export type AnswersKeys = z.infer<typeof answersKeysSchema>;
