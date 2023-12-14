import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

export const firestoreFieldValueSchema = z.custom<FieldValue>(
  (value) => value instanceof FieldValue
);
