import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AssembledQuestion } from '@test-creator/types/assembled-test';

@Component({
  selector: 'app-multi-choice-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './multi-choice-question.component.html',
  styleUrl: './multi-choice-question.component.scss',
})
export class MultiChoiceQuestionComponent implements OnInit {
  @Input({ required: true }) question!: AssembledQuestion;

  readonly userAnswer = new FormGroup({});

  ngOnInit(): void {
    const userAnswer = this.buildUserAnswerForm();

    for (const key in userAnswer.controls) {
      this.userAnswer.addControl(key, userAnswer.controls[key]);
    }
  }

  private buildUserAnswerForm(): FormGroup {
    const controls = this.question.answers.reduce((acc, current) => {
      acc[current.id] = new FormControl(false);

      return acc;
    }, {} as Record<string, FormControl<boolean | null>>);

    return new FormGroup(controls);
  }
}
