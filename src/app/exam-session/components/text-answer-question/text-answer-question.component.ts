import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AssembledQuestion } from '@test-creator/types/assembled-test';

@Component({
  selector: 'app-text-answer-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './text-answer-question.component.html',
  styleUrl: './text-answer-question.component.scss',
})
export class TextAnswerQuestionComponent {
  @Input({ required: true }) question!: AssembledQuestion;

  readonly userAnswer = new FormControl('', Validators.required);
}
