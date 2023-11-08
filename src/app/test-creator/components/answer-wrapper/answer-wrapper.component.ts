import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DocumentDirective } from '@common/directives/document.directive';
import { Answer } from '@test-creator/types/answer';
import {
  ClosedQuestionsTypes,
  QuestionsContentsTypes,
} from '@test-creator/types/questions';
import { AnswerFormGroup } from '@test-creator/types/test-creator-form';

@Component({
  selector: 'app-answer-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './answer-wrapper.component.html',
  styleUrls: ['./answer-wrapper.component.scss'],
})
export class AnswerWrapperComponent<
  TQuestionType extends ClosedQuestionsTypes
> extends DocumentDirective<
  Answer<TQuestionType>,
  AnswerFormGroup<TQuestionType>['controls']
> {
  constructor() {
    super(
      new FormGroup({
        content: new FormControl<
          QuestionsContentsTypes[TQuestionType]['answerContentType']
        >(''),
      })
    );
  }

  override convertFormToDoc(
    value: typeof this.form.value
  ): Answer<TQuestionType> {
    const answer = this.document();

    if (!answer) {
      throw new Error('Answer is not defined');
    }

    return {
      id: answer.id,
      content: value.content ?? '',
      position: answer.position,
    };
  }
}
