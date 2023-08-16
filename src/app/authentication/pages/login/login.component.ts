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
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
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

  private readonly errorConverter = new ConversionMap([
    ['auth/user-not-found', new FirebaseErrorConversionInstruction('email')],
    ['auth/wrong-password', new FirebaseErrorConversionInstruction('password')],
  ]);

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
