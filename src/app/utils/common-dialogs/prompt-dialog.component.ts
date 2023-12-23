import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type PromptDialogData = {
  title: string;
  message: string;
  input: {
    label: string;
    placeholder: string;
  };
};

export type PromptDialogResult = string | undefined;

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      .prompt-input {
        width: 100%;
      }
    `,
  ],
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>

    <mat-dialog-content>
      <p>{{ data.message }}</p>

      <form
        [formGroup]="form"
        id="prompt-dialog-form"
        (ngSubmit)="handleFormSubmit()"
      >
        <mat-form-field class="prompt-input">
          <input
            matInput
            type="text"
            [placeholder]="data.input.label"
            formControlName="input"
          />

          <mat-label>{{ data.input.label }}</mat-label>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button form="prompt-dialog-form" mat-button color="accent">OK</button>
    </mat-dialog-actions>
  `,
})
export class PromptDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);

  readonly data: PromptDialogData = inject(MAT_DIALOG_DATA);
  readonly form = new FormGroup({
    input: new FormControl('', { nonNullable: true }),
  });

  handleFormSubmit() {
    this.dialogRef.close(this.form.controls.input.value);
  }
}
