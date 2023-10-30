import { Directive } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { AnswerFormGroup } from '@test-creator/types/test-creator-form';
import { Question } from './question';

@Directive()
export abstract class ClosedQuestion<
  TQuestion extends ClosedQuestionsTypes
> extends Question<TQuestion> {
  answers!: FormArray<AnswerFormGroup<TQuestion>>;
}
