import { Directive, OnInit, inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { QuestionsTypes } from '@test-creator/types/question';
import { QuestionFormGroup } from '@test-creator/types/question-form-group';

@Directive()
export abstract class Question<TQuestionType extends QuestionsTypes>
  implements OnInit
{
  protected readonly controlContainer = inject(ControlContainer);

  question!: QuestionFormGroup<TQuestionType>;

  ngOnInit(): void {
    this.question = this.controlContainer
      .control as QuestionFormGroup<TQuestionType>;
  }

  get index(): number {
    const name = this.controlContainer.name;

    if (name !== null && Number.isInteger(Number.parseInt(String(name)))) {
      return Number.parseInt(String(name));
    } else {
      throw new Error(
        'FormGroup that contains a question must be a child of a FormArray'
      );
    }
  }
}
