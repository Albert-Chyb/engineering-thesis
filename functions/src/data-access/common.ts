import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  Transaction,
} from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

/**
 * Returns document snapshot if it exists, otherwise throws an error.
 */
export async function ensureExistence<T extends DocumentData>(
  ref: DocumentReference<T>,
  transaction?: Transaction,
): Promise<QueryDocumentSnapshot<T>> {
  const snap = await (transaction ? transaction.get(ref) : ref.get());

  if (!snap.exists) {
    throw new HttpsError('not-found', `Document ${ref.path} does not exist`);
  }

  return snap as QueryDocumentSnapshot<T>;
}
