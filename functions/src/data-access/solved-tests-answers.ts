import { CollectionReference, getFirestore } from 'firebase-admin/firestore';
import { SolvedTestAnswers } from '../models/solved-test-answers';

const db = getFirestore();

export function solvedTestsAnswers(
  sharedTestId: string,
): CollectionReference<SolvedTestAnswers> {
  return db.collection(
    `shared-tests/${sharedTestId}/solved-tests-answers`,
  ) as CollectionReference<SolvedTestAnswers>;
}

export function solvedTestAnswers(sharedTestId: string, solvedTestId: string) {
  return solvedTestsAnswers(sharedTestId).doc(solvedTestId);
}
