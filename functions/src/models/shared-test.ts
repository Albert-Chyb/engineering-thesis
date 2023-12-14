import { z } from 'zod';
import { isOpenQuestion } from '../helpers/is-open-question';
import { testAnswerSchema, testQuestionSchema, testSchema } from './test';

const sharedTestAnswer = testAnswerSchema.extend({ id: z.string() });

const sharedTestQuestion = testQuestionSchema
  .extend({
    id: z.string(),
    answers: z.array(sharedTestAnswer),
  })
  .refine(
    (question) => {
      const type = question.type;

      if (isOpenQuestion(type)) {
        return question.answers.length === 0;
      } else {
        return question.answers.length > 1;
      }
    },
    (question) => {
      const type = question.type;

      if (isOpenQuestion(type)) {
        return {
          message: 'Open question should not have answers',
        };
      } else {
        return {
          message: 'Closed question should have at least two answers',
        };
      }
    }
  );

export const sharedTestSchema = testSchema.extend({
  questions: z.array(sharedTestQuestion).min(1),
});
