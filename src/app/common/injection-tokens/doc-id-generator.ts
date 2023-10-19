import { InjectionToken } from '@angular/core';

export const DOC_ID_GENERATOR = new InjectionToken<() => string>(
  'DOC_ID_GENERATOR'
);
