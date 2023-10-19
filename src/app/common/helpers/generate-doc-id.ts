import { Firestore, collection, doc } from '@angular/fire/firestore';

export function generateId(firestore: Firestore) {
  return doc(collection(firestore, 'dummy-collection')).id;
}
