import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';

@Component({
  selector: 'app-multi-choice-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatListModule],
  templateUrl: './multi-choice-question.component.html',
  styleUrl: './multi-choice-question.component.scss',
})
export class MultiChoiceQuestionComponent {
  @Input({ required: true }) question!: SharedTestQuestion;
  @Input({ required: true }) form!: FormControl<string[] | null>;
}
