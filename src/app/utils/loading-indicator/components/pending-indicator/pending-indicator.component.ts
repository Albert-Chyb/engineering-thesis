import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PendingIndicator } from '@utils/loading-indicator/services/pending-indicator.service';

@Component({
  selector: 'app-pending-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './pending-indicator.component.html',
  styleUrl: './pending-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingIndicatorComponent implements PendingIndicator {
  readonly isShown = signal(false);

  showPendingIndicator() {
    this.isShown.set(true);
  }

  hidePendingIndicator() {
    this.isShown.set(false);
  }
}
