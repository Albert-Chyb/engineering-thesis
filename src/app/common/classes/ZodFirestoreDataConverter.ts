import {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
} from '@angular/fire/firestore';
import { ZodSchema } from 'zod';

export class ZodFirestoreDataConverter<T extends DocumentData>
  implements FirestoreDataConverter<T>
{
  constructor(
    protected readonly toFirestoreSchema: ZodSchema,
    protected readonly fromFirestoreSchema: ZodSchema,
  ) {}

  toFirestore(modelObject: WithFieldValue<T>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<T>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return this.toFirestoreSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): T {
    return this.fromFirestoreSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}
