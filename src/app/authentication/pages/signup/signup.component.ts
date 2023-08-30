import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import {
  SignUpForm,
  SignUpFormValue,
  SignupFormComponent,
} from '../../components/signup-form/signup-form.component';
import { AuthPage } from '../../models/AuthPage';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../types/AppUser';

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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  override buildTask(formValue: SignUpFormValue): Observable<AppUser> {
    const { email, password, displayName } = formValue;

    return this.auth
      .createAccount(email, password)
      .pipe(
        switchMap((user) =>
          this.auth.updateName(displayName).pipe(map(() => user))
        )
      );
  }

  constructor() {
    super();

    this.data$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
