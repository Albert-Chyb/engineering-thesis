import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { SharedTestsMetadataService } from '@tests-sharing/services/shared-tests-metadata.service';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
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
    PageStatesDirective,
    NoDataInfoComponent,
  ],
  templateUrl: './shared-tests-page.component.html',
  styleUrl: './shared-tests-page.component.scss',
  providers: [
    SharedTestsPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: SharedTestsPageStore,
    },
  ],
})
export class SharedTestsPageComponent {
  private readonly store = inject(SharedTestsPageStore);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBars = inject(MatSnackBar);
  private readonly sharedTests = inject(SharedTestsMetadataService);
  private readonly router = inject(Router);

  readonly tests = this.store.tests;

  constructor() {
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
    {
      name: 'create-answers-keys',
      title: 'Klucz odpowiedzi',
      icon: 'add_circle',
      description: 'Utwórz klucz odpowiedzi',
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

      case 'create-answers-keys':
        this.router.navigate(['shared-tests', id, 'create-answers-keys']);
        break;
    }
  }

  private copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }
}
