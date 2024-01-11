import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

export const solvedTestSchema = z.object({
  testTakerName: z.string(),
  testTakerId: z.string(),
  sharedTestId: z.string(),
  sharedTestName: z.string(),
  date: z.custom((value) => value instanceof FieldValue, {
    message: 'Date must be set by a field sentinel',
  }),
  grade: z.number().min(0).max(1).nullable(),
});

export type SolvedTest = z.infer<typeof solvedTestSchema>;
