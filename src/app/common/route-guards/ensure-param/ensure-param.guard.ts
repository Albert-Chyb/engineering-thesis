import { InjectionToken, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ensureParamGuard: (
  requiredParam: string,
  GENERATOR_TOKEN: InjectionToken<() => string>
) => CanActivateFn = (requiredParam, GENERATOR_TOKEN) => (route, state) => {
  const router = inject(Router);
  const generator = inject(GENERATOR_TOKEN);
  const currentRouteParams = route.paramMap;

  if (currentRouteParams.has(requiredParam)) {
    return true;
  }

  const generatedParam = generator();

  router.navigate([state.url, generatedParam]);

  console.log(generatedParam);

  return false;
};
