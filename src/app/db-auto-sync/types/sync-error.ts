export interface SyncError {
  action: 'set' | 'delete' | 'swap';
  originalException: unknown;
}
