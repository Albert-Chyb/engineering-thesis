import { CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import {
  SignUpFormValue,
  SignupFormComponent,
} from '@authentication/components';
import { AuthService } from '@authentication/services';
import {
  EMPTY,
  Observable,
  catchError,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';

@Component({
  standalone: true,
  imports: [CommonModule, SignupFormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  private readonly errorConverter = new ConversionMap([
    [
      'auth/email-already-in-use',
      new FirebaseErrorConversionInstruction('email'),
    ],
  ]);

  /** Where the user should be taken after successful main action */
  private readonly AFTER_SUCCESSFUL_MAIN_ACTION = '/';

  /** Emits new value whenever the form is submitted */
  readonly formValue = signal<SignUpFormValue | null>(null);

  /** Errors that should be set as form errors */
  readonly formErrors = signal<FormGroupErrorObject | null>(null);

  readonly viewModel = computed(() => {
    const signUpFormValue = this.formValue();

    if (!signUpFormValue) {
      return INITIAL_MODEL;
    }

    const { displayName, email, password } = signUpFormValue;

    return toSignalWithErrors(
      this.auth.createAccount(email, password).pipe(
        switchMap((user) =>
          this.auth.updateName(displayName).pipe(map(() => user))
        ),
        catchError((error) => this.handleError(error))
      ),
      {
        injector: this.injector,
      }
    );
  });

  constructor() {
    effect(() => {
      const user = this.viewModel().data();
      const error = this.viewModel().error();

      if (user && !error) {
        this.router.navigateByUrl(this.AFTER_SUCCESSFUL_MAIN_ACTION);
      }
    });
  }

  /** Error handler for catchError operator. */
  private handleError(error: unknown): Observable<never> {
    if (
      error instanceof FirebaseError &&
      this.errorConverter.hasInstruction(error.code)
    ) {
      this.formErrors.set(this.errorConverter.convert(error, error.code));

      return EMPTY;
    } else {
      return throwError(() => error);
    }
  }
}
