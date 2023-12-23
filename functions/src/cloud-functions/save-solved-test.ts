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
  solvedTestAnswersSchema,
} from '../models/solved-test-answers';

const db = getFirestore();

export const saveSolvedTestFnDataSchema = z.object({
  testTakerName: solvedTestSchema.shape.testTakerName,
  sharedTestId: solvedTestSchema.shape.sharedTestId,
  answers: solvedTestAnswersSchema.shape.answers,
});

export type SaveSolvedTestFnData = z.infer<typeof saveSolvedTestFnDataSchema>;

export const saveSolvedTest = onCall<SaveSolvedTestFnData, Promise<string>>(
  (req) => {
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
      const sharedTestData = sharedTestSnapshot.data();

      if (!sharedTestSnapshot.exists || sharedTestData === undefined) {
        throw new HttpsError('invalid-argument', 'Shared test does not exist');
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
        sharedTest: {
          id: data.sharedTestId,
          name: sharedTestData.name,
        },
      });
      const solvedTestAnswersDocData = solvedTestAnswersSchema.parse(data);

      transaction.set(solvedTestRef, solvedTestDocData);
      transaction.set(solvedTestAnswersRef, solvedTestAnswersDocData);

      return solvedTestRef.id;
    });
  },
);
