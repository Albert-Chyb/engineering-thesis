import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

export type SharedTestMetadataDialogResult = {
  name: string;
} | null;

@Component({
  selector: 'app-shared-test-metadata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './shared-test-metadata-dialog.component.html',
  styleUrl: './shared-test-metadata-dialog.component.scss',
})
export class SharedTestMetadataDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);

  readonly metadataForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  handleFormSubmit(): void {
    if (this.metadataForm.valid) {
      this.dialogRef.close(this.metadataForm.value);
    } else {
      this.dialogRef.close(null);
    }
  }
}
