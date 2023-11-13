import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  Subject,
  Subscription,
  concatMap,
  map,
  share,
  take,
  takeUntil,
} from 'rxjs';

/**
 * Task function that returns an observable that emits when the task is done.
 */
type TaskFn = () => Observable<void>;

/**
 * ComponentStore that queues all effects and runs them one by one.
 */
export class QueuedComponentStore<
  TState extends object
> extends ComponentStore<TState> {
  private readonly queue = new Subject<TaskFn>();

  constructor(state: TState) {
    super(state);

    this.queue
      .pipe(
        concatMap((task) => task()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  override effect<
    ProvidedType = void,
    OriginType extends unknown = Observable<ProvidedType>,
    ObservableType = OriginType extends Observable<infer A> ? A : never,
    ReturnType = ProvidedType | ObservableType extends void
      ? (
          observableOrValue?:
            | ObservableType
            | Observable<ObservableType>
            | undefined
        ) => Subscription
      : (
          observableOrValue: ObservableType | Observable<ObservableType>
        ) => Subscription
  >(generator: (origin$: OriginType) => Observable<unknown>): ReturnType {
    const queuedOrigin$ = new Subject<any>();

    return super.effect((origin$) => {
      const stream$ = generator(queuedOrigin$ as OriginType).pipe(share());

      origin$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        const task = () => {
          const doneSignal$ = stream$.pipe(
            map(() => undefined),
            take(1)
          );

          queuedOrigin$.next(value);

          return doneSignal$;
        };

        this.schedule(task);
      });

      return stream$;
    });
  }

  private schedule(task: TaskFn) {
    this.queue.next(task);
  }
}
