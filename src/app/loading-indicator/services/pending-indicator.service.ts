import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  of,
  switchMap,
} from 'rxjs';

const NOOP_INDICATOR: PendingIndicator = {
  showPendingIndicator: () => {},
  hidePendingIndicator: () => {},
} as const;

const NOOP_STATE_CHANGES: PendingStateChanges = {
  onPendingChange$: of({
    isPending: false,
    tasksCount: 0,
  }),
} as const;

const QUICK_TASK_THRESHOLD = 40;

export interface PendingState {
  isPending: boolean;
  tasksCount: number;
}

export interface PendingStateChanges {
  onPendingChange$: Observable<PendingState>;
}

export interface PendingIndicator {
  showPendingIndicator: () => void;
  hidePendingIndicator: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class PendingIndicatorService {
  private readonly pendingIndicatorSubject$ = new Subject<PendingIndicator>();

  private readonly pendingStateChangesSubject$ =
    new Subject<PendingStateChanges>();

  private readonly connectedState$ = this.pendingStateChangesSubject$.pipe(
    switchMap((change) => change.onPendingChange$),
    debounceTime(QUICK_TASK_THRESHOLD)
  );

  constructor() {
    combineLatest({
      state: this.connectedState$,
      indicator: this.pendingIndicatorSubject$,
    })
      .pipe(takeUntilDestroyed())
      .subscribe(({ state, indicator }) => {
        if (state.isPending) {
          indicator.showPendingIndicator();
        } else {
          indicator.hidePendingIndicator();
        }
      });
  }

  connectIndicator(indicator: PendingIndicator) {
    this.pendingIndicatorSubject$.next(indicator);
  }

  disconnectIndicator() {
    this.pendingIndicatorSubject$.next(NOOP_INDICATOR);
  }

  connectStateChanges(stateChanges: PendingStateChanges) {
    this.pendingStateChangesSubject$.next(stateChanges);
  }

  disconnectStateChanges() {
    this.pendingStateChangesSubject$.next(NOOP_STATE_CHANGES);
  }
}
