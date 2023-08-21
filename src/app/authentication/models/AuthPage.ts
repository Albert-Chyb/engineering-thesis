import {
  AfterViewInit,
  Directive,
  Injector,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AbstractControl } from '@angular/forms';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  share,
  switchMap,
  throwError,
} from 'rxjs';
import { BaseFrom } from 'src/app/common/BaseForm';
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
import { toSignalWithErrors } from 'src/app/common/toSignalWithErrors';

@Directive()
export abstract class AuthPage<
  TForm extends Record<string, AbstractControl<any>>,
  TFormValue,
  TTaskResult
> implements AfterViewInit
{
  protected readonly injector = inject(Injector);

  private readonly form$ = new Subject<BaseFrom<TForm, TFormValue>>();

  private readonly formValue$: Observable<TFormValue> = this.form$.pipe(
    switchMap((formRef) => formRef.onFormValue.asObservable())
  );

  readonly model$: Observable<TTaskResult> = this.formValue$.pipe(
    switchMap((formValue) =>
      this.buildTask(formValue).pipe(
        catchError((error) => this.handleError(error))
      )
    ),
    share()
  );

  readonly viewModel = toSignalWithErrors(this.model$);

  private readonly errorsConverter = new ConversionMap([
    ['auth/user-not-found', new FirebaseErrorConversionInstruction('email')],
    ['auth/wrong-password', new FirebaseErrorConversionInstruction('password')],
    [
      'auth/email-already-in-use',
      new FirebaseErrorConversionInstruction('email'),
    ],
  ]);

  @ViewChild(BaseFrom)
  protected readonly formComponentRef!: BaseFrom<TForm, TFormValue>;

  constructor() {
    effect(() => {
      const { data, error } = this.viewModel;

      if (data() && !error()) {
        this.onSuccessfulTaskCompletion?.();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.formComponentRef) {
      throw new Error(
        'An auth page requires a reference to a base form component'
      );
    }

    this.form$.next(this.formComponentRef);
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

  abstract buildTask(formValue: TFormValue): Observable<TTaskResult>;
}

export interface AuthPage<
  TForm extends Record<string, AbstractControl<any>>,
  TFormValue,
  TTaskResult
> {
  onSuccessfulTaskCompletion?(): void;
}
