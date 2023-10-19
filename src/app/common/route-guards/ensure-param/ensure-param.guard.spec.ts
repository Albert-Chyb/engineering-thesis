import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ensureParamGuard } from './ensure-param.guard';

describe('ensureParamGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ensureParamGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
