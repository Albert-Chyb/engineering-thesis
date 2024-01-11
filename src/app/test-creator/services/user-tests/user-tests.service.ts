import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import {
  RawTest,
  RawTestSchema,
  Test,
  TestSchema,
} from '@test-creator/types/test';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserTestsService extends FirestoreCollectionController<
  Test,
  RawTest
> {
  constructor() {
    const firestore = inject(Firestore);
    const auth = inject(AuthService);

    super(
      firestore,
      auth.uid$.pipe(map((uid) => `users/${uid}/tests`)),
      new ZodFirestoreDataConverter(RawTestSchema, TestSchema),
    );
  }
}
