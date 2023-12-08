import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  WithFieldValue,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AuthService } from '@authentication/services/auth.service';
import { RawSharedTest, SharedTest } from '@tests-sharing/types/shared-test';
import { Observable, from, map, switchMap } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SharedTest> {
  toFirestore(modelObject: WithFieldValue<SharedTest>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SharedTest>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return {};
  }

  fromFirestore(snapshot: QueryDocumentSnapshot<RawSharedTest>): SharedTest {
    return {
      ...snapshot.data(),
      id: snapshot.id,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class SharedTestsService {
  private readonly functions = inject(Functions);
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);

  shareTest(testId: string) {
    return from(
      httpsCallable<{ testId: string }, string>(
        this.functions,
        'shareTest'
      )({ testId })
    ).pipe(map((res) => res.data));
  }

  getSharedTests(): Observable<SharedTest[]> {
    return this.auth.uid$.pipe(
      switchMap((uid) =>
        from(
          getDocs(query(this.getCollectionRef(), where('author', '==', uid)))
        )
      ),
      map((snapshots) =>
        snapshots.docs.map((snapshot) => snapshot.data() as SharedTest)
      )
    );
  }

  generateLink(id: string) {
    const routePath = `/take-test/${id}`;
    const origin = this.document.location.origin;
    const absolutePath = this.location.normalize(origin + routePath);

    return absolutePath;
  }

  private getCollectionRef() {
    return collection(this.firestore, 'shared-tests').withConverter(
      new DataConverter()
    );
  }
}
