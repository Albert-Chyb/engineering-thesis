import {
  Directive,
  EventEmitter,
  Input,
  Output,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

/**
 * A directive that helps with syncing data between a reactive form and a store.
 */
@Directive({
  standalone: true,
})
export abstract class DocumentDirective<
  TDoc extends object,
  TDocControl extends { [K in keyof TDocControl]: AbstractControl<any, any> }
> {
  private readonly _document = signal<TDoc | null>(null);
  readonly document = this._document.asReadonly();

  @Input({ required: true, alias: 'document' }) set documentSetter(
    doc: TDoc | null
  ) {
    this._document.set(doc);
  }

  @Output() readonly onDocChange = new EventEmitter<TDoc>();
  @Output() readonly onDocDelete = new EventEmitter<TDoc>();

  constructor(public form: FormGroup<TDocControl>) {
    effect(() => {
      const doc = this.document();

      if (!doc) {
        return;
      }

      this.form.patchValue(doc, { emitEvent: false });
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(500))
      .subscribe((value) =>
        this.onDocChange.emit(this.convertFormToDoc(value))
      );
  }

  emitDocDelete() {
    const doc = this.document();

    if (!doc) {
      return;
    }

    this.onDocDelete.emit(doc);
  }

  abstract convertFormToDoc(value: typeof this.form.value): TDoc;
}
