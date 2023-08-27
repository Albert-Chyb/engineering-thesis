import { Directive, Injector, ViewChild, effect, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  Observable,
  Subject,
  catchError,
  share,
  switchMap,
  throwError,
} from 'rxjs';
import { BaseFrom, FormGroupErrorObject } from './BaseForm';
import { toSignalWithErrors } from './toSignalWithErrors';

/**
 * Base class for pages that perform an action based on a form submission.
 */

@Directive()
export abstract class FormActionBasedPage<
  TForm extends Record<string, AbstractControl<any>>,
  TFormValue extends { [K in keyof TForm]: TForm[K]["value"]; },
  TTaskResult
> {
  /**
   * Reference to the Angular injector.
   */
  protected readonly injector = inject(Injector);

  /**
   * Emits the reference to the form component.
   */
  private readonly form$ = new Subject<BaseFrom<TForm, TFormValue>>();

  /**
   * Emits the form value.
   */
  private readonly formValue$: Observable<TFormValue> = this.form$.pipe(
    switchMap((formRef) => formRef.onFormValue.asObservable())
  );

  /**
   * Emits the data returned from the task.
   */
  readonly data$: Observable<TTaskResult> = this.formValue$.pipe(
    switchMap((formValue) =>
      this.buildTask(formValue).pipe(
        catchError((error) => this.handleError(error))
      )
    ),
    share()
  );

  /**
   * Contains the data returned from the task or the error.
   */
  readonly viewModel = toSignalWithErrors(this.data$);

  /**
   * Reference to the form component.
   */
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

  /**
   * Insert an error in the form.
   * @param error Error to insert in the form
   */
  protected insertFormError(error: FormGroupErrorObject) {
    this.formComponentRef.errors = error;
  }

  /**
   * Build the task that will be executed when the form is submitted.
   * @param formValue The value of the form
   */
  abstract buildTask(formValue: TFormValue): Observable<TTaskResult>;

  /**
   * Handle an error that occurred during the execution of the task.
   * This method will be used inside the catchError operator of the model$ observable.
   * @param error Error to handle
   * @returns Observable that will be returned by the model$ observable
   */
  protected handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }
}

export interface FormActionBasedPage<
  TForm extends Record<string, AbstractControl<any>>,
  TFormValue,
  TTaskResult
> {
  onSuccessfulTaskCompletion?(): void;
}
