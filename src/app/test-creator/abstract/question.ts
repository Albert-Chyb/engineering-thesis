import { Directive, Input, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TestCreatorPageStore } from '@test-creator/pages/test-creator-page/test-creator-page.store';
import { QuestionsTypes } from '@test-creator/types/questions';
import { debounceTime, map, tap } from 'rxjs';
import { Question as QuestionDoc } from '../types/question';

@Directive()
export abstract class Question<TQuestionType extends QuestionsTypes> {
  private readonly store = inject(TestCreatorPageStore);

  private readonly _question = signal<QuestionDoc<TQuestionType> | null>(null);
  @Input({ required: true }) set question(
    value: QuestionDoc<TQuestionType> | null
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

  readonly questionForm = new FormGroup({
    content: new FormControl(''),
    type: new FormControl<TQuestionType>('' as TQuestionType, {
      nonNullable: true,
    }),
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
        },
        { emitEvent: false }
      );
    });

    this.store.saveQuestion(
      this.questionForm.valueChanges.pipe(
        map((value) => this.createQuestionFromFormValue(value)),
        tap((question) => this.store.updateQuestion(question)),
        debounceTime(500)
      )
    );
  }

  private createQuestionFromFormValue(
    value: typeof this.questionForm.value
  ): QuestionDoc<TQuestionType> {
    return {
      id: this.question?.id ?? '',
      type: value.type,
      content: value.content ?? '',
    } as QuestionDoc<TQuestionType>;
  }
}
