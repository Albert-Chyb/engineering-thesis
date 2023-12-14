import { z } from 'zod';
import { firestoreFieldValueSchema } from './firestore-field-value';

export const sharedTestMetadataSchema = z.object({
  name: z.string(),
  author: z.string(),
  sharedDate: firestoreFieldValueSchema,
});
