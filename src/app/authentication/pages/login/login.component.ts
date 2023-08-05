import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginFormComponent } from '@authentication/components';
import { AuthService } from '@authentication/services';
import { LoginFormValue } from '@authentication/types';
import { Subject, from, map, switchMap } from 'rxjs';
import { toSignalWithErrors } from 'src/app/common/toSignalWithErrors';

@Component({
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  private readonly _loginFormValue = new Subject<LoginFormValue>();

  viewModel = toSignalWithErrors(
    this._loginFormValue.pipe(
      switchMap(({ email, password }) => this.auth.signIn(email, password)),
      switchMap((user) =>
        from(this.router.navigateByUrl('/')).pipe(map(() => user))
      )
    )
  );

  loginErrors = computed(() => {
    const error = this.viewModel.error();

    if (error instanceof FirebaseError) {
      const translations: {
        [key: string]: { [key: string]: ValidationErrors };
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

      return translations[error.code];
    }

    return null;
  });

  handleLogin(formValue: LoginFormValue) {
    this._loginFormValue.next(formValue);
  }
}
