import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-question-wrapper',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './question-wrapper.component.html',
  styleUrls: ['./question-wrapper.component.scss'],
})
export class QuestionWrapperComponent {
  /**
   * Emits whenever the delete button is clicked.
   */
  @Output() onDelete = new EventEmitter<void>();
}
