import { DOCUMENT, Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { CloudFunctionsService } from '@utils/cloud-functions/core/cloud-functions.service';
import { ShareTestCloudFnData } from '@utils/cloud-functions/definitions/share-test';
import { Observable, of, switchMap } from 'rxjs';
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
  private readonly cloudFunctions = inject(CloudFunctionsService);
  private readonly auth = inject(AuthService);

  override list(params: string[] = []): Observable<SharedTestMetadata[]> {
    return this.auth.uid$.pipe(
      switchMap((uid) => this.query(params, where('author', '==', uid))),
    );
  }

  shareTest(data: ShareTestCloudFnData): Observable<string> {
    return this.cloudFunctions.call('shareTest', data);
  }

  generateLink(id: string) {
    const routePath = `/exam-session/${id}`;
    const origin = this.document.location.origin;
    const absolutePath = this.location.normalize(origin + routePath);

    return absolutePath;
  }
}
