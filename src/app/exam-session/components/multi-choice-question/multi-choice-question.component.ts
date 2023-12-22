import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { AssembledQuestion } from '@test-creator/types/assembled-test';

@Component({
  selector: 'app-multi-choice-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatListModule],
  templateUrl: './multi-choice-question.component.html',
  styleUrl: './multi-choice-question.component.scss',
})
export class MultiChoiceQuestionComponent {
  @Input({ required: true }) question!: AssembledQuestion;
  @Input({ required: true }) form!: FormControl<string[] | null>;
}
