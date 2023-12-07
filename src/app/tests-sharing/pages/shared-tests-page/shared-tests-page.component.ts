import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { SharedTestsPageStore } from './shared-tests-page.store';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-shared-tests-page',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
  providers: [SharedTestsPageStore],
})
export class SharedTestsPageComponent {
  private readonly store = inject(SharedTestsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);

  readonly isLoading = this.store.isLoading$;

  constructor() {
    this.pendingIndicator.connectStateChanges({
      onPendingChange$: this.store.isPending$,
    });
  }
}
