import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OpenQuestion } from '@test-creator/abstract/open-question';

@Component({
  selector: 'app-open-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.scss'],
})
export class OpenQuestionComponent extends OpenQuestion<'text-answer'> {}
