import { pauseableBuffer } from '@common/rxjs-utils/pausable-buffer';
import { ChangeSource } from '@db-auto-sync/abstract/change-source';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import {
  Observable,
  Subject,
  catchError,
  concatMap,
  map,
  of,
  pairwise,
  share,
  startWith,
  switchMap,
} from 'rxjs';

export class DocumentSync<TObj> {
  /** Emits whenever the syncing should be stopped. */
  private readonly stopSync$ = new Subject<void>();

  /** Emits whenever the syncing should be restored. */
  private readonly startSync$ = new Subject<void>();

  /** Emits whenever the value was saved on the server. */
  private readonly serverChanges$: Observable<TObj> = pauseableBuffer(
    this.changeSource.valueChanges,
    this.startSync$.pipe(startWith(undefined)),
    this.stopSync$
  ).pipe(
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
   * Initializes the syncing logic. To be run only once.
   * 
   * @returns An observable that emits the values that were saved on the server.
   */
  init() {
    return this.serverChanges$.pipe(share());
  }

  /**
   * Starts synchronizing the value changes with the server.
   */
  startSync() {
    this.startSync$.next();
  }

  /**
   * Stops synchronizing the values changes with the server.
   * The values changes made since stopping the syncing will not be lost 
   * and will be sent to the server as soon as the syncing is resumed.
   */
  stopSync() {
    this.stopSync$.next();
  }
}
