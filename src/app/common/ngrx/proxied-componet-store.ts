import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, Subscription, defer, tap } from 'rxjs';

export interface ProxiedComponentStoreConfig {
  /** Runs on every new value of an effect. */
  beforeEffect?: () => void;

  /** Runs on every completion of an effect. */
  afterEffect?: () => void;

  /** Runs on every error of an effect. */
  errorEffect?: (error: unknown) => void;
}

export class ProxiedComponentStore<
  TState extends object
> extends ComponentStore<TState> {
  constructor(
    state: TState,
    private readonly config?: ProxiedComponentStoreConfig
  ) {
    super(state);
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
    return super.effect((newValuesSource$) => {
      const trappedNewValuesSource$ = newValuesSource$.pipe(
        tap(() => this.config?.beforeEffect?.())
      ) as OriginType;

      return defer(() =>
        generator(trappedNewValuesSource$).pipe(
          tapResponse(
            () => {
              this.callBeforeEffect();
            },
            (error) => {
              this.callAfterEffect();
              this.callErrorEffect(error);
            },
            () => this.callAfterEffect()
          )
        )
      );
    });
  }

  protected callBeforeEffect(): void {
    this.config?.beforeEffect?.();
  }

  protected callAfterEffect(): void {
    this.config?.afterEffect?.();
  }

  protected callErrorEffect(error: unknown): void {
    this.config?.errorEffect?.(error);
  }
}
