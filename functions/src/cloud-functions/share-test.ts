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
import { z } from 'zod';
import {
  getQuestionAnswers,
  getQuestions,
  getTest,
} from '../data-access/created-tests';
import { generateId } from '../helpers/generateId';
import { sharedTestSchema } from '../models/shared-test';
import { sharedTestMetadataSchema } from '../models/shared-test-metadata';

const db = getFirestore();

const dataSchema = z.object({
  testId: z.string(),
  name: z.string(),
});

type ParamsSchema = z.infer<typeof dataSchema>;

function createSharedTestMetadata(
  metadata: { name: string },
  auth: AuthData,
): DocumentData {
  return {
    name: metadata.name,
    author: auth.uid,
    sharedDate: FieldValue.serverTimestamp(),
  };
}

function createSharedTest(
  test: DocumentSnapshot<DocumentData>,
  questions: QuerySnapshot<DocumentData>,
  answers: [string, QuerySnapshot<DocumentData>][],
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
        }),
      ),
    })),
  };
}

export const shareTest = onCall<ParamsSchema, Promise<string>>(
  { cors: true },
  (request) => {
    return db.runTransaction<string>(async (transaction: Transaction) => {
      if (!request.auth) {
        throw new HttpsError(
          'unauthenticated',
          'You must be signed in to share a test',
        );
      }

      const dataValidation = dataSchema.safeParse(request.data);

      if (!dataValidation.success) {
        throw new HttpsError(
          'invalid-argument',
          `Invalid cloud function params`,
          dataValidation.error,
        );
      }
      const { testId } = dataValidation.data;
      const testRef = getTest(testId, request.auth);
      const test = await transaction.get(testRef);

      if (!test.exists) {
        throw new HttpsError(
          'not-found',
          `Test with id ${testId} was not found`,
        );
      }

      const questionsRef = getQuestions(testRef);
      const questions = await transaction.get(questionsRef);

      const answers = await Promise.all(
        questions.docs.map((question) =>
          transaction
            .get(getQuestionAnswers(testRef, question.ref))
            .then(
              (answers) =>
                [question.id, answers] as [string, QuerySnapshot<DocumentData>],
            ),
        ),
      );

      const id = generateId(db);
      const sharedTestMetadata = createSharedTestMetadata(
        request.data,
        request.auth,
      );
      const sharedTest = createSharedTest(test, questions, answers);
      const sharedTestValidation = sharedTestSchema.safeParse(sharedTest);

      if (!sharedTestValidation.success) {
        throw new HttpsError(
          'failed-precondition',
          `Created test is not in the valid shape`,
          sharedTestValidation.error.issues.map((i) => i.message).join('\n'),
        );
      }

      const sharedTestMetadataValidation =
        sharedTestMetadataSchema.safeParse(sharedTestMetadata);

      if (!sharedTestMetadataValidation.success) {
        throw new HttpsError(
          'internal',
          `Could not create shared test metadata`,
          sharedTestMetadataValidation,
        );
      }

      transaction
        .create(
          db.doc(`shared-tests-metadata/${id}`),
          sharedTestMetadataValidation.data,
        )
        .create(db.doc(`shared-tests/${id}`), sharedTestValidation.data);

      return id;
    });
  },
);
