import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClosedQuestion } from '@test-creator/abstract/closed-question';

@Component({
  selector: 'app-multi-choice-question',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  templateUrl: './multi-choice-question.component.html',
  styleUrls: ['./multi-choice-question.component.scss'],
})
export class MultiChoiceQuestionComponent extends ClosedQuestion<'multi-choice'> {}
