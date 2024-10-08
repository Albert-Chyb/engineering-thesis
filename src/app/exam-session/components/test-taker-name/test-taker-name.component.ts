import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-test-taker-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './test-taker-name.component.html',
  styleUrl: './test-taker-name.component.scss',
})
export class TestTakerNameComponent {
  @Input({ required: true }) form!: FormControl;
}
