import { z } from 'zod';

export const SingleChoiceQuestionAnswerSchema = z.string();

export const MultipleChoiceQuestionAnswerSchema = z.array(z.string());

export const TextAnswerQuestionAnswerSchema = z.string();

export type SingleChoiceQuestionAnswer = z.infer<
  typeof SingleChoiceQuestionAnswerSchema
>;
export type MultipleChoiceQuestionAnswer = z.infer<
  typeof MultipleChoiceQuestionAnswerSchema
>;
export type TextAnswerQuestionAnswer = z.infer<
  typeof TextAnswerQuestionAnswerSchema
>;
