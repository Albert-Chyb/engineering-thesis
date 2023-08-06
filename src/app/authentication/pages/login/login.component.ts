import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Router } from '@angular/router';
import { LoginFormComponent } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { LoginFormValue } from '@authentication/types';
import { catchError, of, take } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';

@Component({
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  loginError = signal<any>(null);
  formErrors = computed(() => {
    const error = this.loginError();

    if (error instanceof FirebaseError) {
      return this.convertAuthErrorIntoFormError(error);
    }

    return null;
  });

  handleLogin(formValue: LoginFormValue) {
    const { email, password } = formValue;

    this.auth
      .signIn(email, password)
      .pipe(
        catchError((error) => {
          this.loginError.set(error);
          
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
