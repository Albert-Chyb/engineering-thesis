import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take } from 'rxjs';
import { BottomSheetAction } from './bottom-sheet-action';
import {
  BottomSheetActionsComponent,
  BottomSheetActionsData,
  BottomSheetActionsResult,
} from './bottom-sheet-actions.component';

@Directive({
  selector: '[appBottomSheetActionsTrigger]',
  standalone: true,
})
export class BottomSheetActionsTriggerDirective {
  private readonly bottomSheets = inject(MatBottomSheet);

  @Input({ alias: 'appBottomSheetActionsTrigger' })
  actions: BottomSheetAction[] = [];

  @Output() onActionClick = new EventEmitter<string>();

  /**
   * Shows bottom sheet with actions.
   */
  @HostListener('click')
  showActions() {
    const bottomSheetRef = this.bottomSheets.open<
      BottomSheetActionsComponent,
      BottomSheetActionsData,
      BottomSheetActionsResult
    >(BottomSheetActionsComponent, {
      data: this.actions,
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((action) => {
        if (action) {
          this.onActionClick.emit(action);
        }
      });
  }
}
