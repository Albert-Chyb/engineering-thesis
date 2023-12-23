import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';
import { AuthData } from 'firebase-functions/lib/common/providers/https';

/**
 * Returns reference to the test.
 * @param id Id of the test to get.
 * @param auth Auth data of the user.
 * @returns Reference to the test.
 */
export function getTest(
  id: string,
  auth: AuthData,
): DocumentReference<DocumentData> {
  return getFirestore()
    .collection(`users/${auth.uid}/tests`)
    .doc(id) as DocumentReference<DocumentData>;
}

/**
 * Returns reference to the questions collection.
 * @param testRef Test reference to get questions from.
 * @returns Reference to the questions collection.
 */
export function getQuestions(testRef: DocumentReference<DocumentData>) {
  return testRef
    .collection('questions')
    .orderBy('position', 'asc') as CollectionReference<DocumentData>;
}

/**
 * Returns reference to the answers collection.
 * @param testRef Test reference to get question answers from.
 * @param questionRef Question reference to get answers from.
 * @returns Reference to the answers collection.
 */
export function getQuestionAnswers(
  testRef: DocumentReference<DocumentData>,
  questionRef: DocumentReference<DocumentData>,
) {
  return testRef
    .collection('questions')
    .doc(questionRef.id)
    .collection('answers')
    .orderBy('position', 'asc') as CollectionReference<DocumentData>;
}
