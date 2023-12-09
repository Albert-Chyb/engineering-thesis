import {
  DocumentData,
  DocumentSnapshot,
  FieldValue,
  QuerySnapshot,
  Transaction,
  getFirestore,
} from 'firebase-admin/firestore';
import { AuthData } from 'firebase-functions/lib/common/providers/tasks';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import {
  getQuestionAnswers,
  getQuestions,
  getTest,
} from '../data-access/created-tests';
import { generateId } from '../helpers/generateId';

const db = getFirestore();

function createSharedTestMetadata(
  metadata: { name: string },
  auth: AuthData
): DocumentData {
  return {
    name: metadata.name,
    author: auth.uid,
    sharedDate: FieldValue.serverTimestamp() as any,
  };
}

function createSharedTest(
  test: DocumentSnapshot<DocumentData>,
  questions: QuerySnapshot<DocumentData>,
  answers: [string, QuerySnapshot<DocumentData>][]
): DocumentData {
  return {
    ...test.data(),
    questions: questions.docs.map((question) => ({
      ...question.data(),
      id: question.id,
      answers: (answers.find(([id]) => id === question.id)?.[1].docs ?? []).map(
        (answer) => ({
          ...answer.data(),
          id: answer.id,
        })
      ),
    })),
  };
}

export const shareTest = onCall<
  { testId: string; name: string },
  Promise<string>
>((request) => {
  return db.runTransaction<string>(async (transaction: Transaction) => {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'You must be signed in to share a test'
      );
    }

    const { testId } = request.data;
    const testRef = getTest(testId, request.auth);
    const test = await transaction.get(testRef);

    if (!test.exists) {
      throw new HttpsError('not-found', `Test with id ${testId} was not found`);
    }

    const questionsRef = getQuestions(testRef);
    const questions = await transaction.get(questionsRef);

    const answers = await Promise.all(
      questions.docs.map((question) =>
        transaction
          .get(getQuestionAnswers(testRef, question.ref))
          .then(
            (answers) =>
              [question.id, answers] as [string, QuerySnapshot<DocumentData>]
          )
      )
    );

    const id = generateId(db);

    const sharedTestMetadata = createSharedTestMetadata(
      request.data,
      request.auth
    );

    const sharedTest = createSharedTest(test, questions, answers);

    transaction
      .create(db.doc(`shared-tests-metadata/${id}`), sharedTestMetadata)
      .create(db.doc(`shared-tests/${id}`), sharedTest);

    return id;
  });
});
