import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';
import { SolvedTestAnswerRecordValue } from '@utils/firestore/models/solved-test-answers.model';
import { UserAnswers } from '@utils/firestore/models/user-answers.model';
import { AnswerCollectorOutletComponent } from '../answer-collector-outlet/answer-collector-outlet.component';

@Component({
  selector: 'app-answers-form',
  standalone: true,
  imports: [CommonModule, AnswerCollectorOutletComponent],
  templateUrl: './answers-form.component.html',
  styleUrl: './answers-form.component.scss',
})
export class AnswersFormComponent implements OnChanges {
  @Input({ required: true }) questions: SharedTestQuestion[] = [];
  @Input({ required: true }) formRef!: FormGroup<
    Record<string, FormControl<SolvedTestAnswerRecordValue | null>>
  >;
  @Input() existingAnswers: UserAnswers | null = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (
      'questions' in changes ||
      'formRef' in changes ||
      'existingAnswers' in changes
    ) {
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

  private rebuildAnswersFormGroup(questions: SharedTestQuestion[]) {
    const answersForm: FormGroup = this.formRef;

    for (const controlName in answersForm) {
      answersForm.removeControl(controlName, { emitEvent: false });
    }

    for (const question of questions) {
      answersForm.addControl(
        question.id,
        new FormControl(this.getExistingAnswer(question.id)),
        {
          emitEvent: false,
        },
      );
    }

    answersForm.markAsPristine();
    answersForm.updateValueAndValidity();
  }

  private getExistingAnswer(questionId: string) {
    return this.existingAnswers?.[questionId] ?? null;
  }
}
