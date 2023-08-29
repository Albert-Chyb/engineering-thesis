import { CommonModule } from '@angular/common';
import {
  Component,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, map } from 'rxjs';
import {
  PasswordRecoveryForm,
  PasswordRecoveryFormComponent,
  PasswordRecoveryFormValue,
} from '../../components/password-recovery-form/password-recovery-form.component';
import { AuthPage } from '../../models/AuthPage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    PasswordRecoveryFormComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent extends AuthPage<
  PasswordRecoveryForm,
  PasswordRecoveryFormValue,
  string
> {
  private readonly auth = inject(AuthService);

  /** Contains the latest email sent by the user or an empty string if the user hasn`t submitted the form yet. */
  readonly email: WritableSignal<string> = signal('');

  readonly hasAttemptRecover = computed(() => !!this.email());

  constructor() {
    super();

    this.data$.pipe(takeUntilDestroyed()).subscribe((email) => {
      this.email.set(email);
    });
  }

  resendEmail() {
    if (!this.email) {
      throw new Error('Cannot resend an email without a previous attempt.');
    }

    return this.auth.sendPasswordResetEmail(this.email());
  }

  override buildTask(formValue: PasswordRecoveryFormValue): Observable<string> {
    const { email } = formValue;

    return this.auth.sendPasswordResetEmail(email).pipe(map(() => email));
  }
}
