import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { catchError, map, of, take } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
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

  passwordRecoveryError = signal<unknown>(null);
  formValue = signal<PasswordRecoveryFormValue | null>(null);
  showInstructions = signal<boolean>(false);

  formErrors = computed<FormGroupErrorObject | null>(() => {
    const error = this.passwordRecoveryError();

    if (error instanceof FirebaseError) {
      return this.convertAuthErrorIntoFormError(error);
    }

    return null;
  });

  sendPasswordResetEmail(value: PasswordRecoveryFormValue | null) {
    if (!value) {
      return;
    }

    const { email } = value;

    this.auth
      .sendPasswordResetEmail(email)
      .pipe(
        map((value) => ({ data: value, error: null })),
        catchError((error) => {
          this.passwordRecoveryError.set(error);

          return of({ data: null, error });
        }),
        take(1)
      )
      .subscribe((result) => {
        if (!result.error) {
          this.showInstructions.set(true);

          this.formValue.set(value);
        }
      });
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
