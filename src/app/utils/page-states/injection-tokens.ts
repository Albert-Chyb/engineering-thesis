import { InjectionToken, signal } from '@angular/core';
import { PageStateIndicators } from './page-states-indicators';

const NO_OOP_INDICATORS: PageStateIndicators = {
  isLoading: signal(false),
  error: signal(false),
  isEmpty: signal(false),
  isPending: signal(false),
};

export const PAGE_STATE_INDICATORS = new InjectionToken<PageStateIndicators>(
  'PAGE_STATE_INDICATORS',
  {
    factory: () => NO_OOP_INDICATORS,
  },
);
