import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import {
  SharedTestsActions,
  SharedTestsActionsBottomSheetComponent,
} from '@tests-sharing/components/shared-tests-actions-bottom-sheet/shared-tests-actions-bottom-sheet.component';
import { SharedTestsMetadataService } from '@tests-sharing/services/shared-tests-metadata.service';
import { take } from 'rxjs';
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
    ClipboardModule,
    MatSnackBarModule,
  ],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
  providers: [SharedTestsPageStore],
})
export class SharedTestsPageComponent {
  private readonly store = inject(SharedTestsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly bottomSheets = inject(MatBottomSheet);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBars = inject(MatSnackBar);
  private readonly sharedTests = inject(SharedTestsMetadataService);
  private readonly router = inject(Router);

  readonly isLoading = this.store.isLoading$;
  readonly tests = this.store.tests;

  constructor() {
    this.pendingIndicator.connectStateChanges({
      onPendingChange$: this.store.isPending$,
    });

    this.store.load();
  }

  showTestsActions(id: string) {
    const bottomSheetRef = this.bottomSheets.open<
      SharedTestsActionsBottomSheetComponent,
      void,
      SharedTestsActions
    >(SharedTestsActionsBottomSheetComponent);

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((action) => {
        switch (action) {
          case 'copy-link':
            const link = this.sharedTests.generateLink(id);

            this.copyToClipboard(link);
            this.snackBars.open('Skopiowano link do schowka', 'Zamknij');
            break;

          case 'show-solved-tests':
            this.router.navigate(['shared-tests', id, 'submitted-solutions']);
            break;
        }
      });
  }

  private copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }
}
