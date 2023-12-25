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
import { MultiChoiceQuestionComponent } from '@exam-session/components/multi-choice-question/multi-choice-question.component';
import { SingleChoiceQuestionComponent } from '@exam-session/components/single-choice-question/single-choice-question.component';
import { TextAnswerQuestionComponent } from '@exam-session/components/text-answer-question/text-answer-question.component';
import { AssembledQuestion } from '@test-creator/types/assembled-test';
import { SolvedTestAnswer } from '@tests-grading/types/solved-test-answers';

export type TestGradingFormData = {
  question: AssembledQuestion;
  answer: SolvedTestAnswer;
};

@Component({
  selector: 'app-test-grading-form',
  standalone: true,
  imports: [
    CommonModule,
    SingleChoiceQuestionComponent,
    MultiChoiceQuestionComponent,
    TextAnswerQuestionComponent,
    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
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
