import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExamSessionPageStore } from './exam-session-page.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-session-page.component.html',
  styleUrl: './exam-session-page.component.scss',
  providers: [ExamSessionPageStore],
})
export class ExamSessionPageComponent {}
