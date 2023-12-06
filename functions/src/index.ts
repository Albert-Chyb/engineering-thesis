/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from 'firebase-admin';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const shareTest = onCall<{ testId: string }>(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'You must be signed in to share a test'
    );
  }

  const { testId } = request.data;
  const userId = request.auth.uid;

  // Get test data
  const testData = await admin
    .firestore()
    .doc(`users/${userId}/tests/${testId}`)
    .get();

  // Check if test exists
  if (!testData.exists) {
    throw new HttpsError('not-found', `Test with id ${testId} was not found`);
  }

  // Get the test's questions
  const questions = await admin
    .firestore()
    .collection(`users/${userId}/tests/${testId}/questions`)
    .get();

  // Get the questions' answers
  const answers = await Promise.all(
    questions.docs.map((question) =>
      admin
        .firestore()
        .collection(
          `users/${userId}/tests/${testId}/questions/${question.id}/answers`
        )
        .get()
        .then(
          (answers) =>
            [question.id, answers.docs] as unknown as [
              string,
              admin.firestore.DocumentData[]
            ]
        )
    )
  );

  // Combine all data into a single object
  const sharedTest = {
    ...testData.data(),
    author: userId,
    questions: questions.docs.map((question) => {
      const thisQuestionAnswers =
        answers.find(([questionId]) => question.id === questionId)?.[1] ?? [];

      return {
        ...question.data(),
        id: testData.id,
        answers: thisQuestionAnswers.map((answer) => ({
          ...answer.data(),
          id: answer.id,
        })),
      };
    }),
  };

  // Save the shared test to the database
  const sharedTestRef = await admin
    .firestore()
    .collection('shared-tests')
    .add(sharedTest);

  // Return the shared test's id
  return sharedTestRef.id;
});
