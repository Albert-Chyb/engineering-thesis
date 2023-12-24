import { Timestamp } from '@angular/fire/firestore';
import { z } from 'zod';

export const SolvedTestSchema = z.object({
  testTakerName: z.string(),
  sharedTestId: z.string(),
  id: z.string(),
  date: z.instanceof(Timestamp).transform((timestamp) => timestamp.toDate()),
  grade: z.number().min(0).max(1).nullable(),
});

export type SolvedTest = z.infer<typeof SolvedTestSchema>;
