import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BaseFrom } from 'src/app/common/abstract/BaseForm';

export type PasswordRecoveryForm = {
  email: FormControl<string | null>;
};

/** Type of a value of a VALID password recovery form . */
export type PasswordRecoveryFormValue = {
  [Key in keyof Required<
    FormGroup<PasswordRecoveryForm>['value']
  >]: NonNullable<FormGroup<PasswordRecoveryForm>['value'][Key]>;
};

@Component({
  selector: 'app-password-recovery-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.scss'],
  providers: [
    {
      provide: BaseFrom,
      useExisting: PasswordRecoveryFormComponent,
    },
  ],
})
export class PasswordRecoveryFormComponent extends BaseFrom<
  PasswordRecoveryForm,
  PasswordRecoveryFormValue
> {
  constructor() {
    const form = new FormGroup<PasswordRecoveryForm>({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    super(form);
  }

  get email() {
    return this.form.controls.email;
  }
}
