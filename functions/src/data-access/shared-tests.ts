import { CollectionReference, getFirestore } from 'firebase-admin/firestore';
import { SharedTest } from '../models/shared-test';

const db = getFirestore();

export function sharedTests() {
  return db.collection('shared-tests') as CollectionReference<SharedTest>;
}

export function sharedTest(sharedTestId: string) {
  return sharedTests().doc(sharedTestId);
}
