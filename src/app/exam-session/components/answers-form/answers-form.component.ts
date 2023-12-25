import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssembledQuestion } from '@test-creator/types/assembled-test';
import { SolvedTestAnswerRecordValue } from '@tests-grading/types/solved-test-answers';
import { MultiChoiceQuestionComponent } from '../multi-choice-question/multi-choice-question.component';
import { SingleChoiceQuestionComponent } from '../single-choice-question/single-choice-question.component';
import { TextAnswerQuestionComponent } from '../text-answer-question/text-answer-question.component';

@Component({
  selector: 'app-answers-form',
  standalone: true,
  imports: [
    CommonModule,
    SingleChoiceQuestionComponent,
    MultiChoiceQuestionComponent,
    TextAnswerQuestionComponent,
  ],
  templateUrl: './answers-form.component.html',
  styleUrl: './answers-form.component.scss',
})
export class AnswersFormComponent implements OnChanges {
  @Input({ required: true }) questions: AssembledQuestion[] = [];
  @Input({ required: true }) formRef!: FormGroup<
    Record<string, FormControl<SolvedTestAnswerRecordValue | null>>
  >;

  ngOnChanges(changes: SimpleChanges): void {
    if ('questions' in changes || 'formRef' in changes) {
      this.rebuildAnswersFormGroup(this.questions);
    }
  }

  getAnswerControl(questionId: string) {
    const control = this.formRef.get(questionId) as FormControl;

    if (!control) {
      throw new Error(`No answer control for question with id ${questionId}.`);
    }

    return control;
  }

  private rebuildAnswersFormGroup(questions: AssembledQuestion[]) {
    const answersForm: FormGroup = this.formRef;

    for (const controlName in answersForm) {
      answersForm.removeControl(controlName, { emitEvent: false });
    }

    for (const question of questions) {
      answersForm.addControl(question.id, new FormControl(null), {
        emitEvent: false,
      });
    }

    answersForm.markAsPristine();
    answersForm.updateValueAndValidity();
  }
}
