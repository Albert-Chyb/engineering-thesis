import { Timestamp } from '@angular/fire/firestore';
import { AssembledTest } from '@test-creator/types/assembled-test';

export type SharedTestMetadata = {
  id: string;
  name: string;
  author: string;
  sharedDate: Date;
};

export type RawSharedTestMetadata = Omit<
  SharedTestMetadata,
  'id' | 'sharedDate'
> & {
  sharedDate: Timestamp;
};

export type SharedTest = AssembledTest;

export type RawSharedTest = Omit<SharedTest, 'id'>;
