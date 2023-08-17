import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoginForm,
  LoginFormComponent,
  LoginFormValue,
} from '@authentication/components';
import { AuthService } from '@authentication/services';
import { Observable } from 'rxjs';
import { AuthPage, AuthTask } from '../../models/AuthPage';
import { AppUser } from '../../types/AppUser';

class LoginTaskBuilder implements AuthTask<LoginFormValue, AppUser> {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  build(formValue: LoginFormValue): Observable<AppUser> {
    const { email, password } = formValue;

    return this.auth.signIn(email, password);
  }

  onSuccessfulTaskCompletion(): void {
    this.router.navigateByUrl('/');
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends AuthPage<
  LoginForm,
  LoginFormValue,
  AppUser
> {
  constructor() {
    const auth = inject(AuthService);
    const router = inject(Router);

    super(new LoginTaskBuilder(auth, router));
  }
}
