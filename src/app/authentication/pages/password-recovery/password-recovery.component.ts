import { CommonModule } from '@angular/common';
import { Component, Injector, computed, inject, signal } from '@angular/core';

import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EMPTY, Observable, catchError, map, throwError } from 'rxjs';
import { FormGroupErrorObject } from 'src/app/common/BaseForm';
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
import {
  INITIAL_MODEL,
  toSignalWithErrors,
} from 'src/app/common/toSignalWithErrors';
import {
  PasswordRecoveryFormComponent,
  PasswordRecoveryFormValue,
} from '../../components/password-recovery-form/password-recovery-form.component';
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
export class PasswordRecoveryComponent {
  private readonly auth = inject(AuthService);
  private readonly injector = inject(Injector);
  
  private readonly errorConverter = new ConversionMap([
    ['auth/user-not-found', new FirebaseErrorConversionInstruction('email')],
  ]);

  readonly formValue = signal<PasswordRecoveryFormValue | null>(null);
  readonly formErrors = signal<FormGroupErrorObject | null>(null);

  readonly viewModel = computed(() => {
    const passwordRecoveryFormValue = this.formValue();

    if (!passwordRecoveryFormValue) {
      return INITIAL_MODEL;
    }

    const { email } = passwordRecoveryFormValue;

    return toSignalWithErrors(
      this.auth.sendPasswordResetEmail(email).pipe(
        catchError((error) => this.handleError(error)),
        map(() => true)
      ),
      {
        injector: this.injector,
      }
    );
  });

  readonly wasMainActionSuccessful = computed(() => {
    const { data, error } = this.viewModel();

    return data() && !error();
  });

  resendEmail() {
    const formValue = this.formValue();

    if (!formValue || formValue.email === '') {
      throw new Error('Cannot resend the email without a previous attempt');
    }

    this.formValue.set({ email: formValue.email });
  }

  private handleError(error: unknown): Observable<never> {
    if (
      error instanceof FirebaseError &&
      this.errorConverter.hasInstruction(error.code)
    ) {
      this.formErrors.set(this.errorConverter.convert(error, error.code));

      return EMPTY;
    } else {
      return throwError(() => error);
    }
  }
}
