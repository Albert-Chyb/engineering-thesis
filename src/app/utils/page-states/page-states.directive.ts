import {
  Directive,
  ErrorHandler,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { PendingIndicatorService } from '@utils/loading-indicator/services/pending-indicator.service';
import { map } from 'rxjs';
import { PAGE_STATE_INDICATORS } from './injection-tokens';

type PageStateName = 'loading' | 'empty' | 'data';

@Directive({
  standalone: true,
  selector: '[appPageStates]',
})
export class PageStatesDirective implements OnDestroy {
  private readonly indicators = inject(PAGE_STATE_INDICATORS);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly stateName = computed<PageStateName>(() => {
    if (this.indicators.isLoading()) {
      return 'loading';
    }

    if (this.indicators.isEmpty()) {
      return 'empty';
    }

    return 'data';
  });

  @Input({ required: true }) dataTemplate!: TemplateRef<any>;

  @Input({ required: true }) loadingTemplate!: TemplateRef<any>;

  @Input({ required: true }) emptyTemplate!: TemplateRef<any>;

  constructor() {
    effect(() => {
      const stateName = this.stateName();

      this.viewContainerRef.clear();

      switch (stateName) {
        case 'loading':
          this.viewContainerRef.createEmbeddedView(this.loadingTemplate);
          break;

        case 'empty':
          this.viewContainerRef.createEmbeddedView(this.emptyTemplate);
          break;

        case 'data':
          this.viewContainerRef.createEmbeddedView(this.dataTemplate);
          break;
      }
    });

    effect(() => {
      const error = this.indicators.error();

      if (error) {
        this.errorHandler.handleError(error);
      }
    });

    this.pendingIndicator.connectStateChanges({
      onPendingChange$: toObservable(this.indicators.isPending).pipe(
        map((isPending) => ({ isPending })),
      ),
    });
  }

  ngOnDestroy() {
    this.pendingIndicator.disconnectStateChanges();
  }
}
