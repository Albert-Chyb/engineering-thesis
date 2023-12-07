import { AssembledTest } from '@test-creator/types/assembled-test';

export type SharedTest = AssembledTest & { author: string };

export type RawSharedTest = Omit<SharedTest, 'id'>;
