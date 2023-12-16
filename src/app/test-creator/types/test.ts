import { z } from 'zod';

export const RawTestSchema = z.object({
  name: z.string(),
});

export const TestSchema = RawTestSchema.extend({
  id: z.string(),
});

/** Shape of an object that is returned from the service. */
export type Test = z.infer<typeof TestSchema>;

/** Shape of an object that is stored in the database */
export type RawTest = z.infer<typeof RawTestSchema>;
