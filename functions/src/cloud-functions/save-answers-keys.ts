import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { answersKeysDoc } from '../data-access/answers-keys';
import { ensureExistence } from '../data-access/common';
import { sharedTest } from '../data-access/shared-tests';
import { answersKeysSchema } from '../models/answers-keys';
import { solvedTestAnswerSchema } from '../models/solved-test-answers';

export const saveAnswersKeysDataSchema = z.object({
  answersKeys: z.record(solvedTestAnswerSchema.shape.answer),
  sharedTestId: z.string(),
});

export const saveAnswersKeys = onCall<
  z.infer<typeof saveAnswersKeysDataSchema>
>({ cors: true }, async (req) => {
  const userId = req.auth?.uid;

  if (!userId) {
    throw new HttpsError('unauthenticated', 'User is not authenticated');
  }

  const dataVerification = saveAnswersKeysDataSchema.safeParse(req.data);

  if (!dataVerification.success) {
    throw new HttpsError(
      'invalid-argument',
      'Invalid data passed to the function',
      dataVerification.error.issues.map((issue) => issue.message),
    );
  }

  const { answersKeys, sharedTestId } = dataVerification.data;
  const sharedTestSnap = await ensureExistence(sharedTest(sharedTestId));
  const answersKeysRef = answersKeysDoc(sharedTestId);

  const answersKeysDocVerification = answersKeysSchema.safeParse({
    answersKeys,
    sharedTest: sharedTestSnap.data(),
  });

  if (!answersKeysDocVerification.success) {
    throw new HttpsError(
      'internal',
      'Could not save answers keys',
      answersKeysDocVerification.error.issues
        .map((issue) => issue.message)
        .join('\n'),
    );
  }

  await answersKeysRef.set(answersKeysDocVerification.data);
});
