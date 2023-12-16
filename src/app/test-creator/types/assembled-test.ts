import { Answer } from './answer';
import { QuestionDoc } from './question';
import { Test } from './test';

export type AssembledQuestion = QuestionDoc & {
  answers: Answer[];
};

export type AssembledTest = Test & {
  questions: AssembledQuestion[];
};
