import { Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DocumentDirective } from '@common/directives/document.directive';
import { QuestionsTypes } from '@test-creator/types/questions';
import { QuestionFormGroup } from '@test-creator/types/test-creator-form';
import { Question as QuestionObj } from '../classes/question';

@Directive()
export abstract class Question<
  TQuestionType extends QuestionsTypes
> extends DocumentDirective<
  QuestionObj<TQuestionType>,
  QuestionFormGroup<TQuestionType>['controls']
> {
  constructor() {
    super(
      new FormGroup({
        content: new FormControl('' as string),
      })
    );
  }

  override convertFormToDoc(
    value: typeof this.form.value
  ): QuestionObj<TQuestionType> {
    const question = this.document();

    if (!question) {
      throw new Error('Question is not defined');
    }

    return new QuestionObj<TQuestionType>({
      id: question.id,
      type: question.type,
      content: value.content ?? '',
      position: question.position,
    });
  }
}
