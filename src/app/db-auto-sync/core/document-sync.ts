import { ChangeSource } from '@db-auto-sync/abstract/change-source';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import {
  Observable,
  Subject,
  catchError,
  concatMap,
  map,
  merge,
  of,
  pairwise,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export class DocumentSync<TObj> {
  /** Emits whenever the syncing should be stopped. */
  private readonly stopSync$ = new Subject<void>();

  private readonly valueChanges = new Subject<TObj>();

  /** Emits whenever the value was saved on the server. */
  private readonly serverChanges$: Observable<TObj> =
    this.changeSource.valueChanges.pipe(
      tap((value) => this.valueChanges.next(value)),
      concatMap((value) =>
        this.controller.set(value, this.id).pipe(
          map(() => ({ value, error: null })),
          catchError((error) => of({ value: null, error }))
        )
      ),
      startWith({ value: this.changeSource.value, error: null }),
      pairwise(),
      switchMap(([prev, curr]) => {
        if (curr.value && !curr.error) {
          return of(curr.value);
        } else {
          const latestSuccessfulValue = prev.value as TObj;

          // Emit the latest successful value
          this.valueChanges.next(latestSuccessfulValue);

          // Restore the latest successful value in the change source
          this.changeSource.restoreValue(latestSuccessfulValue);

          return of(latestSuccessfulValue);
        }
      })
    );

  constructor(
    private readonly changeSource: ChangeSource<TObj>,
    private readonly controller: ServerController<TObj>,
    public readonly id: string
  ) {}

  get value() {
    return this.changeSource.value;
  }

  get valueForLocalController() {
    return this.changeSource.forLocalController;
  }

  /**
   * Starts synchronizing the value changes with the server.
   * It treats the calls to the server as side effects.
   */
  startSync() {
    return merge(this.valueChanges, this.serverChanges$).pipe(
      takeUntil(this.stopSync$),
      share()
    );
  }

  /** Stops synchronizing */
  stopSync() {
    this.stopSync$.next();
  }
}
