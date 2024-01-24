import { z } from 'zod';
import { SolvedTestAnswersEvaluationsSchema } from '../../../tests-grading/types/solved-test-answers-evaluations';
import { CloudFunctionDefinition } from '../types/functions-definitions';

export const EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DATA_SCHEMA = z.object({
  answersEvaluations: SolvedTestAnswersEvaluationsSchema,
  sharedTestId: z.string(),
  solvedTestId: z.string(),
});

export const EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_RESULT_SCHEMA = z.union([
  z.null(),
  z.undefined(),
]);

export const EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DEFINITION: CloudFunctionDefinition<'evaluateSolvedTestAnswers'> =
  {
    dataSchema: EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DATA_SCHEMA,
    resultSchema: EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_RESULT_SCHEMA,
  };

export type EvaluateSolvedTestAnswersFnData = z.infer<
  typeof EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DATA_SCHEMA
>;
export type EvaluateSolvedTestAnswersFnResult = z.infer<
  typeof EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_RESULT_SCHEMA
>;
