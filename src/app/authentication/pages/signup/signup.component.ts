import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  SignupFormComponent,
} from '@authentication/components';
import { AuthService } from '@authentication/services';
import { SignUpFormValue } from '@authentication/types';
import { Subject, from, map, switchMap } from 'rxjs';
import { toSignalWithErrors } from 'src/app/common/toSignalWithErrors';

@Component({
  standalone: true,
  imports: [CommonModule, SignupFormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  auth = inject(AuthService);
  router = inject(Router);

  private readonly _loginFormValue$ = new Subject<SignUpFormValue>();
  private readonly _loginTask$ = this._loginFormValue$.asObservable().pipe(
    switchMap(({ email, password, displayName }) =>
      this.auth
        .createAccount(email, password)
        .pipe(switchMap(() => this.auth.updateName(displayName)))
    ),
    switchMap((user) =>
      from(this.router.navigateByUrl('/')).pipe(map(() => user))
    )
  );

  viewModel = toSignalWithErrors(this._loginTask$);

  handleSignUp(formValue: SignUpFormValue) {
    this._loginFormValue$.next(formValue);
  }
}
