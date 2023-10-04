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
  Test,
  TestCreatePayload,
  TestReadPayload,
} from '@test-creator/types/test';
import { map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<Test> {
  toFirestore(modelObject: WithFieldValue<Test>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Test>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return modelObject as any;
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<TestReadPayload>,
    options?: SnapshotOptions | undefined
  ): Test {
    const data = snapshot.data();
    const { name } = data;

    return {
      id: snapshot.id,
      name,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserTestsService extends FirestoreCollectionController<
  Test,
  TestCreatePayload
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

    super(collectionRef$);
  }
}
