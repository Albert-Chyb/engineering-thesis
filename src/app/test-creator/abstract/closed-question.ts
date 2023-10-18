import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { QuestionsTypes } from '@test-creator/types/question';
import { Question } from './question';

@Directive()
export abstract class ClosedQuestion
  extends Question<Exclude<QuestionsTypes, 'open'>>
  implements OnInit
{
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

  override ngOnInit() {
    super.ngOnInit();
    this.answers = this.question.controls.answers;
  }
}
