import { z } from 'zod';
import { AnswerSchema } from './answers.model';
import { QuestionSchema, QuestionsTypes } from './questions.model';
import { TestSchema } from './tests.model';

export const SharedTestAnswerSchema = AnswerSchema;

export const SharedTestQuestionSchema = QuestionSchema.extend({
  answers: z.array(AnswerSchema),
});

export const SharedTestSchema = TestSchema.extend({
  questions: z.array(SharedTestQuestionSchema),
});

export type SharedTestQuestion<
  TQuestionType extends QuestionsTypes = QuestionsTypes,
> = z.infer<typeof SharedTestQuestionSchema> & { type: TQuestionType };

export type SharedTest = z.infer<typeof SharedTestSchema>;
