import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SharedTestsMetadataService } from '@utils/firestore/collections-controllers/shared-tests-metadata.service';
import { SharedTestMetadata } from '@utils/firestore/models/shared-test-metadata.model';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { switchMap, tap } from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

export interface SharedTestsPageState {
  tests: SharedTestMetadata[];
  error: any;
  loadingState: LoadingState;
}

const INITIAL_STATE: SharedTestsPageState = {
  tests: [],
  error: null,
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class SharedTestsPageStore
  extends ComponentStore<SharedTestsPageState>
  implements PageStateIndicators
{
  private readonly sharedTests = inject(SharedTestsMetadataService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly isLoading = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly isPending = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isPending(state.loadingState),
  );

  readonly isEmpty = this.selectSignal((state) => state.tests.length === 0);

  readonly error = this.selectSignal((state) => state.error);

  readonly tests = this.selectSignal((state) => state.tests);

  readonly load = this.effect(($) =>
    $.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap(() => this.sharedTests.list()),
      tapResponse(
        (tests) => {
          this.setTests(tests);
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
          }));
        },
        (error) => {
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
            error,
          }));
        },
      ),
    ),
  );

  private readonly setTests = this.updater(
    (state, tests: SharedTestMetadata[]) => ({
      ...state,
      tests,
    }),
  );
}
