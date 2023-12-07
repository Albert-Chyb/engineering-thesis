import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-tests-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
})
export class SharedTestsPageComponent {}
