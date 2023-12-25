import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export function solvedTests(sharedTestId: string) {
  return db
    .collection('shared-tests')
    .doc(sharedTestId)
    .collection('solved-tests');
}

export function solvedTest(sharedTestId: string, solvedTestId: string) {
  return solvedTests(sharedTestId).doc(solvedTestId);
}
