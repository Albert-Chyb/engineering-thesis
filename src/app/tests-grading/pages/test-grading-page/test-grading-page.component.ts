import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
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
  private readonly route = inject(ActivatedRoute);

  readonly solvedTest = this.store.solvedTest;
  readonly solvedTestAnswers = this.store.solvedTestAnswers;

  constructor() {
    this.store.load(this.getParams());
  }

  private getParams(): Observable<{
    sharedTestId: string;
    solvedTestId: string;
  }> {
    return this.route.paramMap.pipe(
      map((params) => {
        const sharedTestId = params.get('sharedTestId');
        const solvedTestId = params.get('solvedTestId');

        if (!sharedTestId || !solvedTestId) {
          throw new Error('Missing params');
        }

        return { sharedTestId, solvedTestId };
      }),
    );
  }
}
