import { DocumentReference, getFirestore } from 'firebase-admin/firestore';
import { SharedTestMetadata } from '../models/shared-test-metadata';

const db = getFirestore();

export function sharedTestsMetadata() {
  return db.collection('shared-tests-metadata');
}

export function sharedTestMetadata(sharedTestId: string) {
  return sharedTestsMetadata().doc(
    sharedTestId,
  ) as DocumentReference<SharedTestMetadata>;
}
