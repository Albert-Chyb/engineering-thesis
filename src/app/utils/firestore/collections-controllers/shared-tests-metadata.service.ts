import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { ShareTestCloudFnPayload } from '@tests-sharing/types/share-test-cloud-fn';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { z } from 'zod';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import { mixinDelete } from '../collection-controller-core/delete-mixin';
import { mixinReadOnly } from '../collection-controller-core/read-only-mixin';
import {
  SharedTestMetadata,
  SharedTestMetadataSchema,
} from '../models/shared-test-metadata.model';

class SharedTestsMetadataCollectionController extends CollectionControllerBase<SharedTestMetadata> {
  constructor() {
    super(
      of('shared-tests-metadata'),
      new ZodFirestoreDataConverter(z.never(), SharedTestMetadataSchema),
    );
  }
}

const MixedController = mixinReadOnly<SharedTestMetadata>()(
  mixinDelete<SharedTestMetadata>()(SharedTestsMetadataCollectionController),
);

@Injectable({
  providedIn: 'root',
})
export class SharedTestsMetadataService extends MixedController {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly functions = inject(Functions);
  private readonly auth = inject(AuthService);

  override list(params: string[] = []): Observable<SharedTestMetadata[]> {
    return this.auth.uid$.pipe(
      switchMap((uid) => this.query(params, where('author', '==', uid))),
    );
  }

  shareTest(data: ShareTestCloudFnPayload): Observable<string> {
    return from(
      httpsCallable<ShareTestCloudFnPayload, string>(
        this.functions,
        'shareTest',
      )(data),
    ).pipe(map((res) => res.data));
  }

  generateLink(id: string) {
    const routePath = `/exam-session/${id}`;
    const origin = this.document.location.origin;
    const absolutePath = this.location.normalize(origin + routePath);

    return absolutePath;
  }
}
