import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  SignUpForm,
  SignUpFormValue,
  SignupFormComponent,
} from '@authentication/components';
import { AuthService } from '@authentication/services';
import { Observable, map, switchMap } from 'rxjs';
import { AuthPage, AuthTask } from '../../models/AuthPage';
import { AppUser } from '../../types/AppUser';

class SignupTaskBuilder implements AuthTask<SignUpFormValue, AppUser> {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  build(formValue: SignUpFormValue): Observable<AppUser> {
    const { email, password, displayName } = formValue;

    return this.auth
      .createAccount(email, password)
      .pipe(
        switchMap((user) =>
          this.auth.updateName(displayName).pipe(map(() => user))
        )
      );
  }

  onSuccessfulTaskCompletion(): void {
    this.router.navigateByUrl('/');
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, SignupFormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends AuthPage<
  SignUpForm,
  SignUpFormValue,
  AppUser
> {
  constructor() {
    const auth = inject(AuthService);
    const router = inject(Router);

    super(new SignupTaskBuilder(auth, router));
  }
}
