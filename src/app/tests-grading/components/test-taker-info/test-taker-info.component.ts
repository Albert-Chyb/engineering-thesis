import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SolvedTest } from '@utils/firestore/models/solved-tests.model';

@Component({
  selector: 'app-test-taker-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './test-taker-info.component.html',
  styleUrl: './test-taker-info.component.scss',
})
export class TestTakerInfoComponent {
  @Input({ required: true }) solvedTest!: SolvedTest | null;
}
