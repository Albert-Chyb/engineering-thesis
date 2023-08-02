import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
import { SignUpFormValue } from '@authentication/types';

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
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent {
  form = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  @Output() signUp = new EventEmitter<SignUpFormValue>();

  handleSignUpSubmit() {
    if (this.form.valid) {
      const { email, password, displayName } = this.form.value;

      this.signUp.emit({
        email: email as string,
        password: password as string,
        displayName: displayName as string,
      });
    }
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
