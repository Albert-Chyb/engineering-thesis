import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from, map } from 'rxjs';
import {
  CloudFunctionData,
  CloudFunctionDefinition,
  CloudFunctionResult,
  CloudFunctionsNames,
} from '../types/functions-definitions';
import { CLOUD_FUNCTIONS_DEFINITIONS_DI_TOKEN } from './functions-definitions-di-token';

@Injectable({ providedIn: 'root' })
export class CloudFunctionsService {
  private readonly functions = inject(Functions);
  private readonly functionsDefinitions = inject(
    CLOUD_FUNCTIONS_DEFINITIONS_DI_TOKEN,
  );

  call<TName extends CloudFunctionsNames>(
    fnName: TName,
    data: CloudFunctionData<TName>,
  ): Observable<CloudFunctionResult<TName>> {
    const def = this.getFnDefinition(fnName);
    const callableFn = httpsCallable<
      CloudFunctionData<TName>,
      CloudFunctionResult<TName>
    >(this.functions, fnName);

    return from(callableFn(def.dataSchema.parse(data))).pipe(
      map((result) => def.resultSchema.parse(result.data)),
    );
  }

  private getFnDefinition<TName extends CloudFunctionsNames>(
    fnName: TName,
  ): CloudFunctionDefinition<TName> {
    const hasDef = fnName in this.functionsDefinitions;

    if (!hasDef) {
      throw new Error(
        `Cloud function definition for '${fnName}' is not provided`,
      );
    }

    return this.functionsDefinitions[fnName] as CloudFunctionDefinition<TName>;
  }
}
