import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  ErrorHandler,
  OnDestroy,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorComponent } from '@utils/loading-indicator/components/loading-indicator/loading-indicator.component';
import { PendingIndicatorService } from '@utils/loading-indicator/services/pending-indicator.service';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { map } from 'rxjs';
import { NoDataInfoComponent } from '../no-data-info/no-data-info.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    NoDataInfoComponent,
    LoadingIndicatorComponent,
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent implements OnDestroy {
  private readonly indicators = inject(PAGE_STATE_INDICATORS);
  private readonly errorHandler = inject(ErrorHandler);
  private readonly pendingIndicator = inject(PendingIndicatorService);

  readonly pageTitle = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly loadingMsg = input<string>('Ładuję...');
  readonly noDataAvailableMsg = input<string>('Brak danych do wyświetlenia.');
  readonly noDataIconPath = input<string>('assets/icons/no-data.svg');

  readonly isLoading = computed(() => this.indicators.isLoading());
  readonly isPending = computed(() => this.indicators.isPending());
  readonly error = computed(() => this.indicators.error());
  readonly isEmpty = computed(() => this.indicators.isEmpty());

  @ContentChild('pageActions')
  readonly pageActionsTemplate: TemplateRef<unknown> | null = null;

  constructor() {
    effect(() => {
      // Because component store cannot throw errors we pass them to error handler manually.
      const error = this.error();

      if (error) {
        this.errorHandler.handleError(error);
      }
    });

    this.pendingIndicator.connectStateChanges({
      onPendingChange$: toObservable(this.isPending).pipe(
        map((isPending) => ({ isPending })),
      ),
    });
  }

  ngOnDestroy(): void {
    this.pendingIndicator.disconnectStateChanges();
  }
}
