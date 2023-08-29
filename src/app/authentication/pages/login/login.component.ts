import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LoginForm,
  LoginFormComponent,
  LoginFormValue,
} from '@authentication/components';
import { AuthService } from '@authentication/services';
import { Observable } from 'rxjs';
import { AuthPage } from '../../models/AuthPage';
import { AppUser } from '../../types/AppUser';

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    super();

    this.data$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  override buildTask(formValue: LoginFormValue): Observable<AppUser> {
    const { email, password } = formValue;

    return this.auth.signIn(email, password);
  }
}
