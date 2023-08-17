import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, map } from 'rxjs';
import {
  PasswordRecoveryForm,
  PasswordRecoveryFormComponent,
  PasswordRecoveryFormValue,
} from '../../components/password-recovery-form/password-recovery-form.component';
import { AuthPage, AuthTask } from '../../models/AuthPage';
import { AuthService } from '../../services/auth.service';

class PasswordRecoveryTaskBuilder
  implements AuthTask<PasswordRecoveryFormValue, boolean>
{
  constructor(private readonly auth: AuthService) {}

  build(formValue: PasswordRecoveryFormValue): Observable<boolean> {
    const { email } = formValue;

    return this.auth.sendPasswordResetEmail(email).pipe(map(() => true));
  }
}

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
  private readonly auth: AuthService;

  readonly wasMainActionSuccessful = computed(() => {
    const { data, error } = this.viewModel();

    return data() && !error();
  });

  constructor() {
    const auth = inject(AuthService);

    super(new PasswordRecoveryTaskBuilder(auth));

    this.auth = auth;
  }

  resendEmail() {
    const formValue = this.formValue();

    if (!formValue || formValue.email === '') {
      throw new Error('Cannot resend the email without a previous attempt');
    }

    return this.auth.sendPasswordResetEmail(formValue.email);
  }
}
