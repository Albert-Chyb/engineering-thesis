import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './unhandled-error.component.html',
  styleUrls: ['./unhandled-error.component.scss'],
})
export class UnhandledErrorComponent {}
