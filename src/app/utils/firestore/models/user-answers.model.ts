import { z } from 'zod';

export const SingleChoiceAnswerSchema = z.string();

export const MultipleChoiceAnswerSchema = z.array(z.string());

export const TextAnswerAnswerSchema = z.string();

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
