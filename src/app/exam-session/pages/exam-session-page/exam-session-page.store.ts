import { Injectable, inject } from '@angular/core';
import { SharedTestsService } from '@exam-session/services/shared-tests.service';
import { SolvedTestsService } from '@exam-session/services/solved-tests.service';
import { SolvedTestFormValue } from '@exam-session/types/solved-test';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { AssembledTest } from '@test-creator/types/assembled-test';
import { SharedTestsMetadataService } from '@tests-sharing/services/shared-tests-metadata.service';
import { SharedTestMetadata } from '@tests-sharing/types/shared-test';
import { Observable, combineLatest, exhaustMap, switchMap, tap } from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

interface ExamSessionPageState {
  metadata: SharedTestMetadata | null;
  test: AssembledTest | null;
  error: any;
  loadingState: LoadingState;
}

const INITIAL_STATE: ExamSessionPageState = {
  metadata: null,
  test: null,
  error: null,
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class ExamSessionPageStore extends ComponentStore<ExamSessionPageState> {
  private readonly sharedTests = inject(SharedTestsService);
  private readonly sharedTestsMetadata = inject(SharedTestsMetadataService);
  private readonly solvedTests = inject(SolvedTestsService);

  readonly pendingIndicatorChanges$ = this.select({
    isPending: this.select((state) =>
      loadingStateAdapter.getSelectors().isPending(state.loadingState),
    ),
  });
  readonly error = this.selectSignal((state) => state.error);
  readonly metadata = this.selectSignal((state) => state.metadata);
  readonly test = this.selectSignal((state) => state.test);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly load = this.effect((id$: Observable<string>) =>
    id$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((id) =>
        combineLatest({
          metadata: this.sharedTestsMetadata.getSharedTestMetadata(id),
          test: this.sharedTests.getSharedTest(id),
        }),
      ),
      tapResponse(
        (data) =>
          this.patchState((state) => ({
            metadata: data.metadata,
            test: data.test,
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
          })),
        (error) =>
          this.patchState((state) => ({
            error,
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
          })),
      ),
    ),
  );

  readonly saveSolvedTest = this.effect(
    (test$: Observable<SolvedTestFormValue>) =>
      test$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.taskStarted(state.loadingState),
          })),
        ),
        exhaustMap((test) => {
          const sharedTestId = this.get((state) => state.test?.id);

          if (!sharedTestId) {
            throw new Error(
              `Cannot save the solved test because the test is not loaded.`,
            );
          }

          return this.solvedTests.saveSolvedTest(sharedTestId, test);
        }),
        tapResponse(
          () =>
            this.patchState((state) => ({
              loadingState: loadingStateAdapter.taskFinished(
                state.loadingState,
              ),
            })),
          (error) =>
            this.patchState((state) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(
                state.loadingState,
              ),
            })),
        ),
      ),
  );
}
