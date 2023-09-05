import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { requireSilentNavigationGuard } from './require-silent-navigation.guard';

describe('requireSilentNavigationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => requireSilentNavigationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
