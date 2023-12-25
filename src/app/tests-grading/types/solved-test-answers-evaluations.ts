import { z } from 'zod';
import { SolvedTestAnswerSchema } from './solved-test-answers';

export const SolvedTestAnswersEvaluationsSchema = z.record(
  SolvedTestAnswerSchema.shape.isCorrect,
);

export type SolvedTestAnswersEvaluations = z.infer<
  typeof SolvedTestAnswersEvaluationsSchema
>;
