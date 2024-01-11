import {
  DocumentReference,
  FieldValue,
  getFirestore,
} from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { SharedTest } from '../models/shared-test';
import { SolvedTest, solvedTestSchema } from '../models/solved-test';
import {
  SolvedTestAnswers,
  solvedTestAnswerSchema,
  solvedTestAnswersSchema,
} from '../models/solved-test-answers';

const db = getFirestore();

export const saveSolvedTestFnDataSchema = z.object({
  testTakerName: solvedTestSchema.shape.testTakerName,
  sharedTestId: solvedTestSchema.shape.sharedTestId,
  answers: z.record(solvedTestAnswerSchema.shape.answer).transform((value) =>
    Object.fromEntries(
      Object.entries(value).map(([questionId, answer]) => [
        questionId,
        {
          answer,
          isCorrect: null,
        },
      ]),
    ),
  ),
});

export type SaveSolvedTestFnData = z.infer<typeof saveSolvedTestFnDataSchema>;

export const saveSolvedTest = onCall<SaveSolvedTestFnData, Promise<string>>(
  { cors: true },
  (req) => {
    const uid = req.auth?.uid;

    if (!uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated to save a solved test',
      );
    }

    const dataValidation = saveSolvedTestFnDataSchema.safeParse(req.data);

    if (!dataValidation.success) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid function data',
        dataValidation.error.issues.map((issue) => issue.message),
      );
    }

    const data = {
      ...dataValidation.data,
      date: FieldValue.serverTimestamp(),
    };

    return db.runTransaction<string>(async (transaction) => {
      const sharedTestRef = db
        .collection('shared-tests')
        .doc(data.sharedTestId) as DocumentReference<SharedTest>;
      const sharedTestSnapshot = await transaction.get(sharedTestRef);

      if (!sharedTestSnapshot.exists) {
        throw new HttpsError('not-found', 'Shared test does not exist');
      }

      const solvedTestRef = db
        .collection(`shared-tests/${data.sharedTestId}/solved-tests`)
        .doc() as DocumentReference<SolvedTest>;

      const solvedTestAnswersRef = db
        .collection(`shared-tests/${data.sharedTestId}/solved-tests-answers`)
        .doc(solvedTestRef.id) as DocumentReference<SolvedTestAnswers>;

      const solvedTestDocData = solvedTestSchema.parse({
        ...data,
        date: FieldValue.serverTimestamp(),
        sharedTestId: sharedTestRef.id,
        grade: null,
        testTakerId: uid,
      });
      const solvedTestAnswersDocData = solvedTestAnswersSchema.parse(data);

      transaction.create(solvedTestRef, solvedTestDocData);
      transaction.create(solvedTestAnswersRef, solvedTestAnswersDocData);

      return solvedTestRef.id;
    });
  },
);
