import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { SharedTestsMetadataService } from '@tests-sharing/services/shared-tests-metadata.service';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
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
    BottomSheetActionsTriggerDirective,
  ],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
  providers: [SharedTestsPageStore],
})
export class SharedTestsPageComponent {
  private readonly store = inject(SharedTestsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
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

  readonly pageActions: BottomSheetAction[] = [
    {
      name: 'copy-link',
      title: 'Pobierz link',
      icon: 'share',
      description: 'Skopiuj link do schowka',
    },
    {
      name: 'show-solved-tests',
      title: 'Rozwiązane testy',
      icon: 'pageview',
      description: 'Przeglądaj przesłane rozwiązania',
    },
  ];

  handlePageAction(actionName: string, id: string) {
    switch (actionName) {
      case 'copy-link':
        const link = this.sharedTests.generateLink(id);

        this.copyToClipboard(link);
        this.snackBars.open('Skopiowano link do schowka', 'Zamknij');
        break;

      case 'show-solved-tests':
        this.router.navigate(['shared-tests', id, 'submitted-solutions']);
        break;
    }
  }

  private copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }
}
