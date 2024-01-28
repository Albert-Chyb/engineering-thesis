import { Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DocumentDirective } from '@common/directives/document.directive';
import { QuestionFormGroup } from '@test-creator/types/test-creator-form';
import { Question as QuestionObj } from '../classes/question';

@Directive()
export abstract class Question extends DocumentDirective<
  QuestionObj,
  QuestionFormGroup['controls']
> {
  constructor() {
    super(
      new FormGroup({
        content: new FormControl('' as string),
      }),
    );
  }

  override convertFormToDoc(value: typeof this.form.value): QuestionObj {
    const question = this.document();

    if (!question) {
      throw new Error('Question is not defined');
    }

    return new QuestionObj({
      id: question.id,
      type: question.type,
      content: value.content ?? '',
      position: question.position,
      testId: question.testId,
    });
  }
}
