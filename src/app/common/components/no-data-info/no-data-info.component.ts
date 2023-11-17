import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-no-data-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './no-data-info.component.html',
  styleUrl: './no-data-info.component.scss',
})
export class NoDataInfoComponent {}
