import { z } from 'zod';
import { SolvedTestAnswersEvaluationsSchema } from './solved-test-answers-evaluations';

export const EvaluateSolvedTestAnswersFnDataSchema = z.object({
  answersEvaluations: SolvedTestAnswersEvaluationsSchema,
  sharedTestId: z.string(),
  solvedTestId: z.string(),
});

export type EvaluateSolvedTestAnswersFnData = z.infer<
  typeof EvaluateSolvedTestAnswersFnDataSchema
>;
