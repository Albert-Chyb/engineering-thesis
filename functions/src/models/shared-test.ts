import { z } from 'zod';
import { isOpenQuestion } from '../helpers/is-open-question';
import { testAnswerSchema, testQuestionSchema, testSchema } from './test';

const sharedTestAnswer = testAnswerSchema.extend({
  id: z.string(),
  content: testAnswerSchema.shape.content.min(1),
});

const sharedTestQuestion = testQuestionSchema
  .extend({
    id: z.string(),
    answers: z.array(sharedTestAnswer),
    content: testQuestionSchema.shape.content.min(1),
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
    },
  );

export const sharedTestSchema = testSchema.extend({
  questions: z.array(sharedTestQuestion).min(1),
  name: testSchema.shape.name.min(1),
});

export type SharedTest = z.infer<typeof sharedTestSchema>;
