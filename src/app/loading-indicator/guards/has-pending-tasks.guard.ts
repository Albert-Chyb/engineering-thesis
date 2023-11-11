import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivateFn } from '@angular/router';
import { HasPendingTasksDialogComponent } from '@loading-indicator/components/has-pending-tasks-dialog/has-pending-tasks-dialog.component';
import { map } from 'rxjs';

export interface HasPendingTasks {
  /** Indicates if the component has unsaved changes.  */
  hasPendingTasks(): boolean;
}

export const hasPendingTasksGuard: CanDeactivateFn<HasPendingTasks> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const isPending = component.hasPendingTasks();
  const dialog = inject(MatDialog);

  if (isPending) {
    return dialog
      .open(HasPendingTasksDialogComponent)
      .afterClosed()
      .pipe(map((decision) => !!decision));
  } else {
    return true;
  }
};
