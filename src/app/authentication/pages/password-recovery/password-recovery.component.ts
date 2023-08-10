import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';

import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';
import { PasswordRecoveryFormComponent } from '../../components/password-recovery-form/password-recovery-form.component';
import { AuthService } from '../../services/auth.service';
import { PasswordRecoveryFormValue } from '../../types/PasswordRecoveryFormValue';

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
export class PasswordRecoveryComponent {
  private readonly auth = inject(AuthService);
  private readonly injector = inject(Injector);

  readonly formValue = signal<PasswordRecoveryFormValue | null>(null);

  readonly viewModel = computed(() => {
    const passwordRecoveryFormValue = this.formValue();

    if (!passwordRecoveryFormValue) {
      return INITIAL_MODEL;
    }

    const { email } = passwordRecoveryFormValue;

    return toSignalWithErrors(
      this.auth.sendPasswordResetEmail(email).pipe(map(() => true)),
      {
        injector: this.injector,
      }
    );
  });

  readonly wasMainActionSuccessful = computed(() => {
    const { data, error } = this.viewModel();

    return data() && !error();
  });

  readonly formErrors = computed<FormGroupErrorObject | null>(() => {
    const error = this.viewModel().error();

    if (error instanceof FirebaseError) {
      return this.convertAuthErrorIntoFormError(error);
    }

    return null;
  });

  resendEmail() {
    const formValue = this.formValue();

    if (!formValue || formValue.email === '') {
      throw new Error('Cannot resend the email without previously sending it');
    }

    this.formValue.set({ email: formValue.email });
  }

  private convertAuthErrorIntoFormError(error: FirebaseError) {
    const { code } = error;

    if (code === 'auth/user-not-found') {
      return {
        email: {
          userNotFound: true,
        },
      };
    } else {
      return null;
    }
  }
}
