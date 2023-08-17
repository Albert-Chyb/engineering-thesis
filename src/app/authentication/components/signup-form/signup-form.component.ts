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
import { RouterLink } from '@angular/router';
import { BaseFrom } from 'src/app/common/BaseForm';

export type SignUpForm = {
  displayName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

/** Type of a value of a VALID signup form. */
export type SignUpFormValue = {
  [Key in keyof Required<FormGroup<SignUpForm>['value']>]: NonNullable<
    Required<FormGroup<SignUpForm>['value']>[Key]
  >;
};

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  providers: [
    {
      provide: BaseFrom,
      useExisting: SignupFormComponent,
    },
  ],
})
export class SignupFormComponent extends BaseFrom<SignUpForm, SignUpFormValue> {
  constructor() {
    const form = new FormGroup<SignUpForm>({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    super(form);
  }

  get email(): FormControl<string | null> {
    return this.form.controls.email;
  }

  get password(): FormControl<string | null> {
    return this.form.controls.password;
  }

  get displayName(): FormControl<string | null> {
    return this.form.controls.displayName;
  }
}
