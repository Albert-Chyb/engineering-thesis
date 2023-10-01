import { Directive, OnInit, inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { QuestionFormGroup } from '@test-creator/types/question-form-group';

@Directive()
export abstract class Question implements OnInit {
  protected readonly controlContainer = inject(ControlContainer);

  question!: QuestionFormGroup;

  ngOnInit(): void {
    this.question = this.controlContainer.control as QuestionFormGroup;
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
