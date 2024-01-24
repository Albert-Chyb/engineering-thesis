import { InjectionToken, Provider } from '@angular/core';
import { CloudFunctionsDefinitions } from '../types/functions-definitions';

export const CLOUD_FUNCTIONS_DEFINITIONS_DI_TOKEN =
  new InjectionToken<CloudFunctionsDefinitions>('FUNCTIONS_DEFINITIONS_TOKEN');

export const provideCloudFunctionsDefinitions = (
  definitions: CloudFunctionsDefinitions,
): Provider => ({
  provide: CLOUD_FUNCTIONS_DEFINITIONS_DI_TOKEN,
  useValue: definitions,
});
