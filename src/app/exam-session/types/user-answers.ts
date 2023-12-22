import { z } from 'zod';

export const SingleChoiceQuestionAnswerSchema = z.string();

export const MultipleChoiceQuestionAnswerSchema = z.array(z.string());

export const TextAnswerQuestionAnswerSchema = z.string();

export const QuestionsAnswerSchema = z.record(
  z.union([
    SingleChoiceQuestionAnswerSchema,
    MultipleChoiceQuestionAnswerSchema,
    TextAnswerQuestionAnswerSchema,
    z.null(),
  ]),
);

export type SingleChoiceQuestionAnswer = z.infer<
  typeof SingleChoiceQuestionAnswerSchema
>;
export type MultipleChoiceQuestionAnswer = z.infer<
  typeof MultipleChoiceQuestionAnswerSchema
>;
export type TextAnswerQuestionAnswer = z.infer<
  typeof TextAnswerQuestionAnswerSchema
>;
export type QuestionsAnswers = z.infer<typeof QuestionsAnswerSchema>;
