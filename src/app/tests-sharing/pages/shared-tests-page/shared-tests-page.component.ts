import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { SharedTestsActionsBottomSheetComponent } from '@tests-sharing/components/shared-tests-actions-bottom-sheet/shared-tests-actions-bottom-sheet.component';
import { SharedTestsPageStore } from './shared-tests-page.store';

@Component({
  selector: 'app-shared-tests-page',
  standalone: true,
  imports: [
    CommonModule,
    LoadingIndicatorComponent,
    MatListModule,
    MatCardModule,
    MatBottomSheetModule,
  ],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
  providers: [SharedTestsPageStore],
})
export class SharedTestsPageComponent {
  private readonly store = inject(SharedTestsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly bottomSheets = inject(MatBottomSheet);

  readonly isLoading = this.store.isLoading$;
  readonly tests = this.store.tests;

  constructor() {
    this.pendingIndicator.connectStateChanges({
      onPendingChange$: this.store.isPending$,
    });

    this.store.load();
  }

  showTestsActions(id: string) {
    this.bottomSheets.open(SharedTestsActionsBottomSheetComponent);
  }
}
