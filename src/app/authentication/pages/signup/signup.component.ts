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
import { SignUpFormValue, SignupFormComponent } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { map, switchMap } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
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

  private readonly AFTER_SUCCESSFUL_MAIN_ACTION = '/';

  readonly formValue = signal<SignUpFormValue | null>(null);

  readonly viewModel = computed(() => {
    const signUpFormValue = this.formValue();

    if (!signUpFormValue) {
      return INITIAL_MODEL;
    }

    const { displayName, email, password } = signUpFormValue;

    return toSignalWithErrors(
      this.auth
        .createAccount(email, password)
        .pipe(
          switchMap((user) =>
            this.auth.updateName(displayName).pipe(map(() => user))
          )
        ),
      {
        injector: this.injector,
      }
    );
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
      const user = this.viewModel().data();
      const error = this.viewModel().error();

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

    const translations: { [key: string]: FormGroupErrorObject } = {
      'auth/email-already-in-use': {
        email: {
          emailAlreadyInUse: true,
        },
      },
    };

    return error.code in translations ? translations[error.code] : null;
  }
}
