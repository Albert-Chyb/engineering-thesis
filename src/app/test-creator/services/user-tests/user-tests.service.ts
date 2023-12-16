import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
  collection,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import {
  RawTest,
  RawTestSchema,
  Test,
  TestSchema,
} from '@test-creator/types/test';
import { map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<Test> {
  toFirestore(modelObject: WithFieldValue<Test>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Test>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return RawTestSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawTest>,
    options?: SnapshotOptions | undefined
  ): Test {
    return TestSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

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

    const collectionRef$ = auth.uid$.pipe(
      map((uid) => {
        if (!uid) {
          throw new Error(
            'Cannot grab the reference to the tests collection because the user is not authenticated.'
          );
        }

        return collection(firestore, `users/${uid}/tests`).withConverter(
          new DataConverter()
        );
      })
    );

    super(firestore, collectionRef$);
  }
}
