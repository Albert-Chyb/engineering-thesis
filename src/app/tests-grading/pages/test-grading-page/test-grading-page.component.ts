import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TestGradingPageStore } from './test-grading-page.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-grading-page.component.html',
  styleUrl: './test-grading-page.component.scss',
  providers: [TestGradingPageStore],
})
export class TestGradingPageComponent {
  private readonly store = inject(TestGradingPageStore);
}
