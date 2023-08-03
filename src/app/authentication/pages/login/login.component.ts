import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  handleLogin(formValue: LoginFormValue) {
    this._loginFormValue.next(formValue);
  }
}
