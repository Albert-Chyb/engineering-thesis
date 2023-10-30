import { Directive } from '@angular/core';
import { OpenQuestionsTypes } from '@test-creator/types/questions';
import { Question } from './question';

@Directive()
export abstract class OpenQuestion<
  TQuestionType extends OpenQuestionsTypes
> extends Question<TQuestionType> {}
