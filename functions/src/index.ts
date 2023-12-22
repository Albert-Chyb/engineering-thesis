import { applicationDefault, initializeApp } from 'firebase-admin/app';

initializeApp({
  credential: applicationDefault(),
});

export { shareTest } from './cloud-functions/share-test';
export { saveSolvedTest } from './cloud-functions/save-solved-test';
