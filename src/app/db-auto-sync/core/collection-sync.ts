import { ErrorHandler } from '@angular/core';
import { LocalController } from '@db-auto-sync/abstract/local-controller';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import {
  Observable,
  Subject,
  catchError,
  concatMap,
  map,
  merge,
  of,
} from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SyncError } from '../types/sync-error';
import { DocumentSync } from './document-sync';

export class CollectionSync<TObj> {
  private readonly docSyncs$ = new Subject<DocumentSync<TObj>>();
  private readonly docSyncs: DocumentSync<TObj>[] = [];

  private readonly tasksQueue$: Subject<Observable<void>> = new Subject();

  constructor(
    private readonly serverController: ServerController<TObj>,
    private readonly localController: LocalController<TObj>,
    private readonly errorHandler?: ErrorHandler
  ) {}

  init(): Observable<void> {
    const syncTasks = this.docSyncs$.pipe(
      mergeMap((docSync) => docSync.startSync()),
      map(() => undefined)
    );

    const operationsTasks: Observable<void> = this.tasksQueue$.pipe(
      concatMap((task) =>
        task.pipe(
          catchError((error) => {
            this.errorHandler?.handleError(error);
            return of(undefined);
          })
        )
      ),
      map(() => undefined)
    );

    return merge(syncTasks, operationsTasks);
  }

  push(docSync: DocumentSync<TObj>) {
    this.docSyncs.push(docSync);
    this.localController.push(docSync.valueForLocalController);
    this.docSyncs$.next(docSync);
  }

  delete(id: string): void {
    // Get the doc sync reference
    const index = this.docSyncs.findIndex((docSync) => docSync.id === id);
    const docSync = this.docSyncs[index];

    if (!docSync) {
      throw new Error(`Document sync with id ${id} not found`);
    }

    // Stop syncing
    docSync.stopSync();

    // Delete the doc sync
    this.docSyncs.splice(index, 1);

    // Delete the local object
    this.localController.removeAt(index);

    // Delete the server object
    const task = this.serverController.delete(id).pipe(
      catchError((error) => {
        // Restore the local object
        this.localController.insert(docSync.valueForLocalController, index);

        // Restore the doc sync
        this.docSyncs.splice(index, 0, docSync);

        this.errorHandler?.handleError({
          action: 'delete',
          originalException: error,
        } as SyncError);
        return of(undefined);
      })
    );

    this.tasksQueue$.next(task);
  }

  /**
   * Swaps the position of two documents inside the collection.
   */
  swap(index1: number, index2: number): void {
    const id1 = this.docSyncs[index1].id;
    const id2 = this.docSyncs[index2].id;

    this.localController.swap(index1, index2);
    this.swapDocSyncs(index1, index2);

    const task = this.serverController.swap(id1, id2).pipe(
      catchError((error) => {
        this.localController.swap(index2, index1);
        this.swapDocSyncs(index2, index1);

        this.errorHandler?.handleError({
          action: 'swap',
          originalException: error,
        } as SyncError);
        return of(undefined);
      })
    );

    this.tasksQueue$.next(task);
  }

  private swapDocSyncs(index1: number, index2: number): void {
    const temp = this.docSyncs[index1];
    this.docSyncs[index1] = this.docSyncs[index2];
    this.docSyncs[index2] = temp;
  }
}
