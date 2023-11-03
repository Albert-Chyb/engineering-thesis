import { Answer } from './answer';
import { QuestionDoc } from './question';
import {
  ClosedQuestionsTypes,
  OpenQuestionsTypes,
  QuestionsTypes,
} from './questions';
import { Test } from './test';

export type AssembledQuestion<TQuestionType extends QuestionsTypes> =
  TQuestionType extends OpenQuestionsTypes
    ? QuestionDoc<TQuestionType>
    : TQuestionType extends ClosedQuestionsTypes
    ? QuestionDoc<TQuestionType> & { answers: Answer<TQuestionType>[] }
    : never;

export type AssembledTest = Test & {
  questions: AssembledQuestion<QuestionsTypes>[];
};
