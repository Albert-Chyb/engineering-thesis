import { z } from 'zod';

export const RawTestSchema = z.object({
  name: z.string(),
});

export const TestSchema = RawTestSchema.extend({
  id: z.string(),
});

export type Test = z.infer<typeof TestSchema>;

export type RawTest = z.infer<typeof RawTestSchema>;
