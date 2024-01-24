import { z } from 'zod';

export const SingleChoiceAnswerSchema = z.string().nullable();

export const MultipleChoiceAnswerSchema = z.array(z.string()).nullable();

export const TextAnswerAnswerSchema = z.string().nullable();

export const UserAnswersSchema = z.record(
  z.union([
    SingleChoiceAnswerSchema,
    MultipleChoiceAnswerSchema,
    TextAnswerAnswerSchema,
    z.null(),
  ]),
);

export type SingleChoiceAnswer = z.infer<typeof SingleChoiceAnswerSchema>;

export type MultipleChoiceAnswer = z.infer<typeof MultipleChoiceAnswerSchema>;

export type TextAnswerAnswer = z.infer<typeof TextAnswerAnswerSchema>;

export type UserAnswers = z.infer<typeof UserAnswersSchema>;
