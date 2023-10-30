import { Directive, Input, Signal, computed, signal } from '@angular/core';
import { questionsGenerators } from '@test-creator/constants/questions-generators';
import { QuestionsTypes } from '@test-creator/types/questions';
import { QuestionFormGroup } from '@test-creator/types/test-creator-form';
import { Question as QuestionDoc } from '../types/question';

@Directive()
export abstract class Question<TQuestionType extends QuestionsTypes> {
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

  readonly questionForm: Signal<QuestionFormGroup<TQuestionType> | null> =
    computed(() => {
      const question = this._question();

      if (question === null) {
        return null;
      }

      return this.generateQuestionForm(question.type, question);
    });

  private getQuestionFormGenerator(type: TQuestionType) {
    return questionsGenerators[type];
  }

  private generateQuestionForm(
    type: TQuestionType,
    question: QuestionDoc<TQuestionType>
  ) {
    const generator = this.getQuestionFormGenerator(type);

    return generator.generate(question);
  }
}
