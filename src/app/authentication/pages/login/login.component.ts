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
import { LoginFormComponent, LoginFormValue } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';

@Component({
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  private readonly FORM_ERROR_CODES = [
    'auth/user-not-found',
    'auth/wrong-password',
  ];

  /** Where this page should redirect the user after he successfully performed the main action on this page. */
  private readonly AFTER_SUCCESSFUL_MAIN_ACTION = '/';

  readonly formValue = signal<LoginFormValue | null>(null);
  readonly formErrors = signal<FormGroupErrorObject | null>(null);

  readonly viewModel = computed(() => {
    const loginFormValue = this.formValue();

    if (!loginFormValue) {
      return INITIAL_MODEL;
    }

    const { email, password } = loginFormValue;

    return toSignalWithErrors(
      this.auth
        .signIn(email, password)
        .pipe(catchError((error) => this.handleError(error))),
      {
        injector: this.injector,
      }
    );
  });

  constructor() {
    effect(() => {
      const viewModel = this.viewModel();
      const user = viewModel.data();
      const error = viewModel.error();

      if (user && !error) {
        this.router.navigateByUrl(this.AFTER_SUCCESSFUL_MAIN_ACTION);
      }
    });
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof FirebaseError && this.isFormError(error)) {
      this.formErrors.set(this.convertAuthErrorIntoFormError(error));

      return EMPTY;
    } else {
      return throwError(() => error);
    }
  }

  private isFormError(error: FirebaseError) {
    return this.FORM_ERROR_CODES.includes(error.code);
  }

  private convertAuthErrorIntoFormError(
    error: FirebaseError
  ): FormGroupErrorObject {
    let formError: FormGroupErrorObject;

    switch (error.code) {
      case 'auth/user-not-found':
        formError = {
          email: {
            userNotFound: true,
          },
        };
        break;

      case 'auth/wrong-password':
        formError = {
          password: {
            wrongPassword: true,
          },
        };
        break;

      default:
        throw new Error('Cannot convert this error into a form error.');
    }

    return formError;
  }
}
