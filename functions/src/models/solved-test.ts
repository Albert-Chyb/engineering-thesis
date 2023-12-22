import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

export const solvedTestSchema = z.object({
  testTakerName: z.string(),
  sharedTest: z.object({
    id: z.string(),
    name: z.string(),
  }),
  date: z.custom((value) => value instanceof FieldValue, {
    message: 'Date must be set by a field sentinel',
  }),
});

export type SolvedTest = z.infer<typeof solvedTestSchema>;
