import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';

@Component({
  selector: 'app-single-choice-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatRadioModule],
  templateUrl: './single-choice-question.component.html',
  styleUrl: './single-choice-question.component.scss',
})
export class SingleChoiceQuestionComponent {
  @Input({ required: true }) question!: SharedTestQuestion;
  @Input({ required: true }) form!: FormControl<string | null>;
}
