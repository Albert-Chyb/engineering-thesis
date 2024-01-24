import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { AnswerCollectorOutletComponent } from '@exam-session/components/answer-collector-outlet/answer-collector-outlet.component';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';
import { SolvedTestAnswer } from '@utils/firestore/models/solved-test-answers.model';

export type TestGradingFormData = {
  question: SharedTestQuestion;
  answer: SolvedTestAnswer;
};

@Component({
  selector: 'app-test-grading-form',
  standalone: true,
  imports: [
    CommonModule,

    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
    AnswerCollectorOutletComponent,
  ],
  templateUrl: './test-grading-form.component.html',
  styleUrl: './test-grading-form.component.scss',
})
export class TestGradingFormComponent {
  @Input({ required: true }) answersEvaluationsForm!: FormGroup<
    Record<string, AbstractControl<boolean | null>>
  >;

  @Input({ required: true }) data!: TestGradingFormData[];

  buildAnswerFormControl(answer: SolvedTestAnswer) {
    const control = new FormControl<any>(answer.answer);
    control.disable();

    return control;
  }
}
