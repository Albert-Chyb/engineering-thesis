import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ControlContainer, FormArray } from '@angular/forms';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { QuestionFormGroup } from '@test-creator/types/question-form-group';

@Directive()
export class ClosedQuestion implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  question!: QuestionFormGroup;
  answers!: FormArray<AnswerFormGroup>;

  @Output() onAnswerReorder = new EventEmitter<AnswersReorderEvent>();

  @Output() onAddAnswer = new EventEmitter<number>();

  @Output() onDeleteAnswer = new EventEmitter<[number, number]>();

  handleAnswersReorder(
    $event: CdkDragDrop<
      FormArray<AnswerFormGroup>,
      FormArray<AnswerFormGroup>,
      AnswerFormGroup
    >
  ) {
    this.onAnswerReorder.emit({
      questionIndex: this.index,
      previousIndex: $event.previousIndex,
      currentIndex: $event.currentIndex,
    });
  }

  ngOnInit() {
    this.question = this.controlContainer.control as QuestionFormGroup;
    this.answers = this.question.controls.answers;
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
