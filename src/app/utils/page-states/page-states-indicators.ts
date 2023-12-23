import { Signal } from '@angular/core';

export interface PageStateIndicators {
  isLoading: Signal<boolean>;
  isPending: Signal<boolean>;
  isEmpty: Signal<boolean>;
  error: Signal<unknown>;
}
