import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { Observable, map } from 'rxjs';
import { TestGradingPageStore } from './test-grading-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageStatesDirective,
    NoDataInfoComponent,
    LoadingIndicatorComponent,
    MatCardModule,
  ],
  templateUrl: './test-grading-page.component.html',
  styleUrl: './test-grading-page.component.scss',
  providers: [
    TestGradingPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: TestGradingPageStore,
    },
  ],
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
