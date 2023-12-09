import { Firestore } from 'firebase-admin/firestore';

export function generateId(firestore: Firestore): string {
  return firestore.collection('a').doc().id;
}
