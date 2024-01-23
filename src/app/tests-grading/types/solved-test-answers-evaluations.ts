import { SolvedTestAnswerSchema } from '@utils/firestore/models/solved-test-answers.model';
import { z } from 'zod';

export const SolvedTestAnswersEvaluationsSchema = z.record(
  SolvedTestAnswerSchema.shape.isCorrect,
);

export type SolvedTestAnswersEvaluations = z.infer<
  typeof SolvedTestAnswersEvaluationsSchema
>;
