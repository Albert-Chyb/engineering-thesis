import { applicationDefault, initializeApp } from 'firebase-admin/app';

initializeApp({
  credential: applicationDefault(),
});

export { evaluateSolvedTestAnswers } from './cloud-functions/evaluate-solved-test-answers';
export { saveSolvedTest } from './cloud-functions/save-solved-test';
export { shareTest } from './cloud-functions/share-test';
