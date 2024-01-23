import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DocumentDirective } from '@common/directives/document.directive';
import { AnswerFormGroup } from '@test-creator/types/test-creator-form';
import { Answer } from '@utils/firestore/models/answers.model';

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
export class AnswerWrapperComponent extends DocumentDirective<
  Answer,
  AnswerFormGroup['controls']
> {
  constructor() {
    super(
      new FormGroup({
        content: new FormControl(''),
      })
    );
  }

  override convertFormToDoc(value: typeof this.form.value): Answer {
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
