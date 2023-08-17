import {
  AfterViewInit,
  Directive,
  Injector,
  Signal,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseError } from '@angular/fire/app';
import { AbstractControl } from '@angular/forms';
import { EMPTY, Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { BaseFrom } from 'src/app/common/BaseForm';
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';

@Directive()
export class AuthPage<
  TForm extends Record<string, AbstractControl<any>>,
  TFormValue,
  TTaskResult
> implements AfterViewInit
{
  protected readonly injector = inject(Injector);

  private readonly form = signal<BaseFrom<TForm, TFormValue> | undefined>(
    undefined
  );

  private readonly formValue$: Observable<TFormValue | undefined> =
    toObservable(this.form).pipe(
      switchMap(
        (formRef) => formRef?.onFormValue.asObservable() ?? of(undefined)
      )
    );

  public readonly formValue: Signal<TFormValue | undefined> = toSignal(
    this.formValue$
  );

  public readonly viewModel: Signal<{
    data: Signal<TTaskResult | undefined | null>;
    error: Signal<unknown>;
  }> = computed(() => {
    const formValue = this.formValue?.();

    if (!formValue) {
      return INITIAL_MODEL;
    }

    return toSignalWithErrors(
      this.taskBuilder
        .build(formValue)
        .pipe(catchError((error) => this.handleError(error))),
      {
        injector: this.injector,
      }
    );
  });

  private readonly errorsConverter = new ConversionMap([
    ['auth/user-not-found', new FirebaseErrorConversionInstruction('email')],
    ['auth/wrong-password', new FirebaseErrorConversionInstruction('password')],
    [
      'auth/email-already-in-use',
      new FirebaseErrorConversionInstruction('email'),
    ],
  ]);

  @ViewChild(BaseFrom)
  private readonly formComponentRef!: BaseFrom<TForm, TFormValue>;

  constructor(private readonly taskBuilder: AuthTask<TFormValue, TTaskResult>) {
    effect(() => {
      const { data, error } = this.viewModel();

      if (data() && !error()) {
        this.taskBuilder.onSuccessfulTaskCompletion?.();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.formComponentRef) {
      throw new Error(
        'An auth page requires a reference to a base form component'
      );
    }

    this.form.set(this.formComponentRef);
  }

  private handleError(error: unknown): Observable<never> {
    if (
      error instanceof FirebaseError &&
      this.errorsConverter.hasInstruction(error.code)
    ) {
      this.formComponentRef.errors = this.errorsConverter.convert(
        error,
        error.code
      );

      return EMPTY;
    } else {
      return throwError(() => error);
    }
  }
}

export interface AuthTask<TFormValue, TTaskResult> {
  build(formValue: TFormValue): Observable<TTaskResult>;

  onSuccessfulTaskCompletion?(): void;
}
