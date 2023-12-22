import { Timestamp } from '@angular/fire/firestore';
import { z } from 'zod';

export const SolvedTestSchema = z.object({
  testTakerName: z.string(),
  sharedTest: z.object({
    id: z.string(),
    name: z.string(),
  }),
  id: z.string(),
  date: z.instanceof(Timestamp).transform((timestamp) => timestamp.toDate()),
});

export type SolvedTest = z.infer<typeof SolvedTestSchema>;
