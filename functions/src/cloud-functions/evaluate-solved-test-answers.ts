import { PartialWithFieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { ensureExistence } from '../data-access/common';
import { sharedTestMetadata } from '../data-access/shared-tests-metadata';
import { solvedTest } from '../data-access/solved-tests';
import { solvedTestAnswers } from '../data-access/solved-tests-answers';
import { solvedTestSchema } from '../models/solved-test';
import {
  SolvedTestAnswers,
  solvedTestAnswerSchema,
} from '../models/solved-test-answers';

const db = getFirestore();

export const answersEvaluationsSchema = z.record(
  solvedTestAnswerSchema.shape.isCorrect,
);

export const fnDataSchema = z.object({
  answersEvaluations: answersEvaluationsSchema,
  sharedTestId: z.string(),
  solvedTestId: z.string(),
});

export type FnData = z.infer<typeof fnDataSchema>;
export type AnswersEvaluations = z.infer<typeof answersEvaluationsSchema>;

function createUpdateObj(
  evaluations: AnswersEvaluations,
): PartialWithFieldValue<SolvedTestAnswers> {
  return Object.entries(evaluations).reduce(
    (acc, [questionId, isCorrect]) => ({
      ...acc,
      [`answers.${questionId}.isCorrect`]: isCorrect,
    }),
    {},
  );
}

function calcGrade(solvedTest: SolvedTestAnswers): number | null {
  const answers = Object.values(solvedTest.answers);

  const allAnswersChecked = answers.every(
    (answer) => answer.isCorrect !== null,
  );

  if (!allAnswersChecked) {
    return null;
  }

  const total = answers.length;
  const correct = answers.filter((answer) => answer.isCorrect === true).length;

  return correct / total;
}

export const evaluateSolvedTestAnswers = onCall<FnData>(async (req) => {
  const uid = req.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User is not authenticated');
  }

  const { answersEvaluations, sharedTestId, solvedTestId } = fnDataSchema.parse(
    req.data,
  );

  await db.runTransaction<void>(async (transaction) => {
    const sharedTestMetadataSnapshot = await ensureExistence(
      sharedTestMetadata(sharedTestId),
      transaction,
    );

    const sharedTestMetadataData = sharedTestMetadataSnapshot.data();

    if (sharedTestMetadataData.author !== uid) {
      throw new HttpsError(
        'permission-denied',
        'Only author can evaluate test answers',
      );
    }

    const solvedTestAnswersRef = solvedTestAnswers(sharedTestId, solvedTestId);

    await ensureExistence(solvedTestAnswersRef, transaction);

    transaction.update(
      solvedTestAnswersRef,
      answersEvaluationsSchema.parse(
        createUpdateObj(answersEvaluations),
      ) as PartialWithFieldValue<SolvedTestAnswers>,
    );
  });

  const solvedTestRef = solvedTest(sharedTestId, solvedTestId);
  const solvedTestAnswersSnapshot = await ensureExistence(
    solvedTestAnswers(sharedTestId, solvedTestId),
  );
  const solvedTestAnswersData = solvedTestAnswersSnapshot.data();

  await solvedTestRef.update({
    grade: solvedTestSchema.shape.grade.parse(calcGrade(solvedTestAnswersData)),
  });
});
