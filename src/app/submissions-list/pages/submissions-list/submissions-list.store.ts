import { Injectable, Signal, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SolvedTestsService } from '@utils/firestore/collections-controllers/solved-tests.service';
import { SolvedTest } from '@utils/firestore/models/solved-tests.model';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { switchMap, tap } from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

interface SubmissionsListComponentState {
  loadingState: LoadingState;
  error: unknown;
  submissions: SolvedTest[];
}

const INITIAL_STATE: SubmissionsListComponentState = {
  loadingState: loadingStateAdapter.getInitialState(),
  error: null,
  submissions: [],
};

@Injectable()
export class SubmissionsListComponentStore
  extends ComponentStore<SubmissionsListComponentState>
  implements PageStateIndicators
{
  private readonly solvedTests = inject(SolvedTestsService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly submissions = this.selectSignal((state) => state.submissions);

  readonly isLoading: Signal<boolean> = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly isPending: Signal<boolean> = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isPending(state.loadingState),
  );

  readonly isEmpty: Signal<boolean> = this.selectSignal(
    (state) => state.submissions.length === 0,
  );

  readonly error: Signal<unknown> = this.selectSignal((state) => state.error);

  readonly load = this.effect(($) =>
    $.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap(() => this.solvedTests.listForCurrentUser()),
      tapResponse(
        (submissions) =>
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
            submissions,
          })),
        (error) =>
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
            error,
          })),
      ),
    ),
  );
}
