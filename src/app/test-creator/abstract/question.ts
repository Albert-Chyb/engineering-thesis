import {
  Directive,
  EventEmitter,
  Input,
  Output,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionsTypes } from '@test-creator/types/questions';
import { debounceTime } from 'rxjs';
import { Question as QuestionObj } from '../classes/question';

@Directive()
export abstract class Question<TQuestionType extends QuestionsTypes> {
  private readonly _question = signal<QuestionObj<TQuestionType> | null>(null);
  @Input({ required: true }) set question(
    value: QuestionObj<TQuestionType> | null
  ) {
    this._question.set(value);
  }
  get question() {
    return this._question();
  }

  private readonly _index = signal<number>(-1);
  @Input({ required: true }) set index(value: number) {
    this._index.set(value);
  }
  get index() {
    return this._index();
  }

  @Output() readonly onQuestionUpdate = new EventEmitter<
    QuestionObj<TQuestionType>
  >();

  @Output() readonly onQuestionDelete = new EventEmitter<
    QuestionObj<TQuestionType>
  >();

  readonly questionForm = new FormGroup({
    content: new FormControl(''),
    type: new FormControl<TQuestionType>('' as TQuestionType, {
      nonNullable: true,
    }),
    position: new FormControl(this.index, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const question = this._question();

      if (!question) {
        return;
      }

      this.questionForm.setValue(
        {
          content: question.content,
          type: question.type,
          position: question.position,
        },
        { emitEvent: false }
      );
    });

    this.questionForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(500))
      .subscribe((value) => {
        this.onQuestionUpdate.emit(this.createQuestionFromFormValue(value));
      });
  }

  private createQuestionFromFormValue(
    value: typeof this.questionForm.value
  ): QuestionObj<TQuestionType> {
    return new QuestionObj<TQuestionType>({
      id: this.question?.id ?? '',
      type: value.type as TQuestionType,
      content: value.content ?? '',
      position: value.position as number,
    });
  }
}
