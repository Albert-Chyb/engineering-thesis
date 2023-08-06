import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { SignupFormComponent } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { SignUpFormValue } from '@authentication/types';
import { catchError, of, switchMap, take } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';

@Component({
  standalone: true,
  imports: [CommonModule, SignupFormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  auth = inject(AuthService);
  router = inject(Router);
  signUpError = signal<any>(null);
  formErrors = computed(() => {
    const error = this.signUpError();

    if (error instanceof FirebaseError) {
      return this.convertAuthErrorIntoFormError(error);
    }

    return null;
  });

  handleSignUp(formValue: SignUpFormValue) {
    const { email, password, displayName } = formValue;

    this.auth
      .createAccount(email, password)
      .pipe(
        switchMap(() => this.auth.updateName(displayName)),
        catchError((error) => {
          this.signUpError.set(error);

          return of(null);
        }),
        take(1)
      )
      .subscribe((user) => {
        if (user) {
          this.router.navigateByUrl('/');
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
