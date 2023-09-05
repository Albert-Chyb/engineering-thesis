import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * It requires the navigation not to change the URL.
 */
export const requireSilentNavigationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);

  return router.getCurrentNavigation()?.extras?.skipLocationChange ?? false;
};
