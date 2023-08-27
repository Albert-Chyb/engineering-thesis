import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, map, tap } from 'rxjs';
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
  boolean
> {
  private readonly auth = inject(AuthService);

  readonly wasMainActionSuccessful = computed(() => {
    const viewModel = this.viewModel;

    return viewModel?.data() && !viewModel?.error();
  });

  email: string = '';

  resendEmail() {
    if (!this.email) {
      throw new Error('Cannot resend an email without a previous attempt.');
    }

    return this.auth.sendPasswordResetEmail(this.email);
  }

  override buildTask(
    formValue: PasswordRecoveryFormValue
  ): Observable<boolean> {
    const { email } = formValue;

    return this.auth.sendPasswordResetEmail(email).pipe(
      map(() => true),
      tap(() => (this.email = email))
    );
  }
}
