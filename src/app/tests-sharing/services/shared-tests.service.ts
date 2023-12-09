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
import { ShareTestCloudFnPayload } from '@tests-sharing/types/share-test-cloud-fn';
import {
  RawSharedTestMetadata,
  SharedTestMetadata,
} from '@tests-sharing/types/shared-test';
import { Observable, from, map, switchMap } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SharedTestMetadata> {
  toFirestore(modelObject: WithFieldValue<SharedTestMetadata>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SharedTestMetadata>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return {};
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawSharedTestMetadata>
  ): SharedTestMetadata {
    return {
      ...snapshot.data(),
      id: snapshot.id,
      sharedDate: snapshot.data().sharedDate.toDate(),
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

  shareTest(data: ShareTestCloudFnPayload): Observable<string> {
    return from(
      httpsCallable<ShareTestCloudFnPayload, string>(
        this.functions,
        'shareTest'
      )(data)
    ).pipe(map((res) => res.data));
  }

  getSharedTests(): Observable<SharedTestMetadata[]> {
    return this.auth.uid$.pipe(
      switchMap((uid) =>
        from(
          getDocs(
            query(this.getMetadataCollectionRef(), where('author', '==', uid))
          )
        )
      ),
      map((snapshots) => snapshots.docs.map((snapshot) => snapshot.data()))
    );
  }

  generateLink(id: string) {
    const routePath = `/take-test/${id}`;
    const origin = this.document.location.origin;
    const absolutePath = this.location.normalize(origin + routePath);

    return absolutePath;
  }

  private getMetadataCollectionRef() {
    return collection(this.firestore, 'shared-tests-metadata').withConverter(
      new DataConverter()
    );
  }
}
