import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Answer } from '@test-creator/types/answer';
import {
  ClosedQuestionsTypes,
  QuestionsContentsTypes,
} from '@test-creator/types/questions';
import { AnswerFormGroup } from '@test-creator/types/test-creator-form';
import { debounceTime } from 'rxjs';

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
> {
  private readonly _answer = signal<Answer<TQuestionType> | null>(null);
  @Input({ required: true }) set answer(value: Answer<TQuestionType> | null) {
    this._answer.set(value);
  }
  get answer(): Answer<TQuestionType> | null {
    return this._answer();
  }

  @Output() readonly onAnswerDelete = new EventEmitter<Answer<TQuestionType>>();
  @Output() readonly onAnswerChange = new EventEmitter<Answer<TQuestionType>>();

  readonly answerForm: AnswerFormGroup<TQuestionType> = new FormGroup({
    content: new FormControl<
      QuestionsContentsTypes[TQuestionType]['answerContentType']
    >(''),
  });

  constructor() {
    effect(() => {
      const answer = this._answer();

      if (!answer) {
        return;
      }

      this.answerForm.setValue(
        {
          content: answer.content,
        },
        { emitEvent: false }
      );
    });

    this.answerForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(500))
      .subscribe((answer) => {
        this.onAnswerChange.emit(this.createAnswerFromForm(answer));
      });
  }

  emitAnswerDelete(): void {
    if (!this.answer) {
      throw new Error('Answer is not defined');
    }

    this.onAnswerDelete.emit(this.answer);
  }

  private createAnswerFromForm(
    value: typeof this.answerForm.value
  ): Answer<TQuestionType> {
    if (!this.answer) {
      throw new Error('Answer is not defined');
    }

    return {
      id: this.answer.id,
      content: value.content ?? '',
    };
  }
}
