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
import { LoginFormComponent } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';
import { LoginFormValue } from '../../types/LoginFormValue';

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

  /** Where this page should redirect the user after he successfully performed the main action on this page. */
  private readonly AFTER_SUCCESSFUL_MAIN_ACTION = '/';

  readonly formValue = signal<LoginFormValue | null>(null);

  readonly viewModel = computed(() => {
    const loginFormValue = this.formValue();

    if (!loginFormValue) {
      return INITIAL_MODEL;
    }

    const { email, password } = loginFormValue;

    return toSignalWithErrors(this.auth.signIn(email, password), {
      injector: this.injector,
    });
  });

  readonly formErrors = computed(() => {
    const error = this.viewModel().error();

    if (error instanceof FirebaseError) {
      return this.convertAuthErrorIntoFormError(error);
    }

    return null;
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

  private convertAuthErrorIntoFormError(
    error: FirebaseError
  ): FormGroupErrorObject | null {
    if (!error.code.startsWith('auth/')) {
      return null;
    }

    const translations: {
      [key: string]: FormGroupErrorObject;
    } = {
      'auth/user-not-found': {
        email: {
          userNotFound: true,
        },
      },
      'auth/wrong-password': {
        password: {
          wrongPassword: true,
        },
      },
    };

    return error.code in translations ? translations[error.code] : null;
  }
}
