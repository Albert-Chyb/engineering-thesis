import { Timestamp } from '@angular/fire/firestore';
import { z } from 'zod';

export const SharedTestMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string(),
  sharedDate: z.instanceof(Timestamp).transform((t) => t.toDate()),
});

export type SharedTestMetadata = z.infer<typeof SharedTestMetadataSchema>;

export type RawSharedTestMetadata = z.infer<typeof SharedTestMetadataSchema>;
