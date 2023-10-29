import { Answer } from './answer';
import { Question } from './question';
import {
  ClosedQuestionsTypes,
  OpenQuestionsTypes,
  QuestionsTypes,
} from './questions';
import { Test } from './test';

export type AssembledQuestion<TQuestionType extends QuestionsTypes> =
  TQuestionType extends OpenQuestionsTypes
    ? Question<TQuestionType>
    : TQuestionType extends ClosedQuestionsTypes
    ? Question<TQuestionType> & { answers: Answer<TQuestionType>[] }
    : never;

export type AssembledTest = Test & {
  questions: AssembledQuestion<QuestionsTypes>[];
};
