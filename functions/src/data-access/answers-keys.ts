import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';
import { AnswersKeys } from '../models/answers-keys';

const db = getFirestore();

export function answersKeysDocs() {
  return db.collection('answers-keys') as CollectionReference<AnswersKeys>;
}

export function answersKeysDoc(sharedTestId: string) {
  return answersKeysDocs().doc(sharedTestId) as DocumentReference<AnswersKeys>;
}
