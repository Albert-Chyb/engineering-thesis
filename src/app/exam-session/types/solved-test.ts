import { FieldValue } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore';
import { z } from 'zod';
import {
  MultipleChoiceQuestionAnswerSchema,
  SingleChoiceQuestionAnswerSchema,
  TextAnswerQuestionAnswerSchema,
} from './user-answers';

export const RawSolvedTestSchema = z.object({
  testTakerName: z.string(),
  date: z.custom((value) => value instanceof FieldValue, {
    message: 'The date field has to be set by a field sentinel',
  }),
  answers: z.record(
    z.union([
      SingleChoiceQuestionAnswerSchema,
      MultipleChoiceQuestionAnswerSchema,
      TextAnswerQuestionAnswerSchema,
      z.null(),
    ]),
  ),
  sharedTest: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const SolvedTestSchema = RawSolvedTestSchema.extend({
  id: z.string(),
  date: z.instanceof(Timestamp).transform((timestamp) => timestamp.toDate()),
});

export const SolvedTestFormValueSchema = z.object({
  testTakerName: RawSolvedTestSchema.shape.testTakerName,
  answers: RawSolvedTestSchema.shape.answers,
});

export type RawSolvedTest = z.infer<typeof RawSolvedTestSchema>;
export type SolvedTest = z.infer<typeof SolvedTestSchema>;
export type SolvedTestFormValue = z.infer<typeof SolvedTestFormValueSchema>;
