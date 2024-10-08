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
import { BaseFrom } from 'src/app/common/abstract/BaseForm';

export type LoginForm = {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

/** Type of a value of a valid login form. */
export type LoginFormValue = {
  [Key in keyof Required<FormGroup<LoginForm>['value']>]: NonNullable<
    FormGroup<LoginForm>['value'][Key]
  >;
};

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [
    {
      provide: BaseFrom,
      useExisting: LoginFormComponent,
    },
  ],
})
export class LoginFormComponent extends BaseFrom<LoginForm, LoginFormValue> {
  constructor() {
    const form = new FormGroup<LoginForm>({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    super(form);
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }
}
