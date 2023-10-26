import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-question-actions',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './question-actions.component.html',
  styleUrls: ['./question-actions.component.scss'],
})
export class QuestionActionsComponent {
  @Output() onQuestionDelete = new EventEmitter<void>();
}
