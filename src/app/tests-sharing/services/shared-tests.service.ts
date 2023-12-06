import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedTestsService {
  private readonly functions = inject(Functions);

  shareTest(testId: string) {
    return from(
      httpsCallable<{ testId: string }, string>(
        this.functions,
        'shareTest'
      )({ testId })
    ).pipe(map((res) => res.data));
  }
}
