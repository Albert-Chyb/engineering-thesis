import { Answer } from './answer';
import { Question, QuestionsTypes } from './question';
import { Test } from './test';

export type AssembledQuestion<QuestionType extends QuestionsTypes> =
  Question<QuestionType> & { answers?: Answer<QuestionType>[] };

export interface AssembledTest extends Test {
  questions: AssembledQuestion<QuestionsTypes>[];
}
