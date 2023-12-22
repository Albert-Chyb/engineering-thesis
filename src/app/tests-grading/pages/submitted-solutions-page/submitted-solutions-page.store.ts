import { Injectable, inject } from '@angular/core';
import { SolvedTestsService } from '@exam-session/services/solved-tests.service';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SolvedTest } from '@tests-grading/types/solved-test';
import {
  Observable,
  catchError,
  mergeMap,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

type SubmittedSolutionsPageState = {
  solvedTests: SolvedTest[];
  loadingState: LoadingState;
  error: unknown;
};

const INITIAL_STATE: SubmittedSolutionsPageState = {
  solvedTests: [],
  loadingState: loadingStateAdapter.getInitialState(),
  error: null,
};

@Injectable()
export class SubmittedSolutionsPageStore extends ComponentStore<SubmittedSolutionsPageState> {
  private readonly solvedTestsService = inject(SolvedTestsService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly solvedTests = this.selectSignal((state) => state.solvedTests);
  readonly error = this.selectSignal((state) => state.error);
  readonly pendingState$ = this.select({
    isPending: this.select((state) =>
      loadingStateAdapter.getSelectors().isPending(state.loadingState),
    ),
  });
  readonly isLoading = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly load = this.effect((sharedTestId$: Observable<string>) =>
    sharedTestId$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((sharedTestId) => this.solvedTestsService.list(sharedTestId)),
      tapResponse(
        (solvedTests) =>
          this.patchState((state) => ({
            solvedTests,
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

  readonly delete = this.effect(
    (ids$: Observable<{ solvedTestId: string; sharedTestId: string }>) =>
      ids$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.taskStarted(state.loadingState),
          })),
        ),
        mergeMap(({ solvedTestId, sharedTestId }) => {
          const solvedTest = this.get((state) =>
            state.solvedTests.find(
              (solvedTest) => solvedTest.id === solvedTestId,
            ),
          );

          if (!solvedTest) {
            throw new Error(`Solved test with id ${solvedTestId} not found`);
          }

          this.removeSolvedTest(solvedTestId);

          return this.solvedTestsService
            .delete(sharedTestId, solvedTestId)
            .pipe(
              catchError((error) => {
                this.addSolvedTest(solvedTest);

                return throwError(() => error);
              }),
            );
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

  private removeSolvedTest(solvedTestId: string) {
    this.patchState((state) => ({
      solvedTests: state.solvedTests.filter(
        (solvedTest) => solvedTest.id !== solvedTestId,
      ),
    }));
  }

  private addSolvedTest(solvedTest: SolvedTest) {
    this.patchState((state) => ({
      solvedTests: this.sortTestsByDate([...state.solvedTests, solvedTest]),
    }));
  }

  private sortTestsByDate(tests: SolvedTest[]) {
    return tests.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
