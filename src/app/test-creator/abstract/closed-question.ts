import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { AnswerFormGroup } from '@test-creator/types/test-creator-form';
import { Question } from './question';

@Directive()
export abstract class ClosedQuestion<TQuestion extends ClosedQuestionsTypes>
  extends Question<TQuestion>
  implements OnInit
{
  answers!: FormArray<AnswerFormGroup<TQuestion>>;

  @Output() onAnswerReorder = new EventEmitter<
    AnswersReorderEvent<TQuestion>
  >();

  @Output() onAddAnswer = new EventEmitter<number>();

  @Output() onDeleteAnswer = new EventEmitter<[number, number]>();

  handleAnswersReorder(
    $event: CdkDragDrop<
      FormArray<AnswerFormGroup<TQuestion>>,
      FormArray<AnswerFormGroup<TQuestion>>,
      AnswerFormGroup<TQuestion>
    >
  ) {
    this.onAnswerReorder.emit({
      questionIndex: this.index,
      previousIndex: $event.previousIndex,
      currentIndex: $event.currentIndex,
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.answers = this.question.controls.answers as FormArray<
      AnswerFormGroup<TQuestion>
    >;
  }
}
