import { OpenQuestionsTypes } from '@test-creator/types/questions';
import { Question } from './question';

export abstract class OpenQuestion<
  TQuestionType extends OpenQuestionsTypes
> extends Question<TQuestionType> {}
