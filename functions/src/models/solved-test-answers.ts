import { z } from 'zod';

export const solvedTestAnswersSchema = z.object({
  answers: z.record(z.union([z.string(), z.array(z.string()), z.null()])),
});

export type SolvedTestAnswers = z.infer<typeof solvedTestAnswersSchema>;
