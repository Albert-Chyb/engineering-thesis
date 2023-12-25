import { PartialWithFieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { ensureExistence } from '../data-access/common';
import { sharedTestMetadata } from '../data-access/shared-tests-metadata';
import { solvedTest } from '../data-access/solved-tests';
import { solvedTestAnswers } from '../data-access/solved-tests-answers';
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
  const statistics = {
    correct: 0,
    incorrect: 0,
    pending: 0,
  };

  for (const questionId in solvedTest.answers) {
    if (Object.prototype.hasOwnProperty.call(solvedTest.answers, questionId)) {
      const answers = solvedTest.answers[questionId];

      if (answers.isCorrect === null) {
        statistics.pending++;
      } else if (answers.isCorrect) {
        statistics.correct++;
      } else {
        statistics.incorrect++;
      }
    }
  }

  if (statistics.pending > 0) {
    return null;
  }

  return statistics.correct / (statistics.correct + statistics.incorrect);
}

export const evaluateSolvedTestAnswers = onCall<FnData>((req) => {
  const uid = req.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'User is not authenticated');
  }

  return db.runTransaction<void>(async (transaction) => {
    const { answersEvaluations, sharedTestId, solvedTestId } =
      fnDataSchema.parse(req.data);

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

    const solvedTestAnswersData = await ensureExistence(
      solvedTestAnswersRef,
      transaction,
    );

    transaction.update(
      solvedTestAnswersRef,
      answersEvaluationsSchema.parse(
        createUpdateObj(answersEvaluations),
      ) as PartialWithFieldValue<SolvedTestAnswers>,
    );

    transaction.update(solvedTest(sharedTestId, solvedTestId), {
      grade: calcGrade(solvedTestAnswersData.data()),
    });
  });
});
