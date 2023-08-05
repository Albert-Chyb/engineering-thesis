import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { setControlsErrors } from './setControlsErrors';

@Directive({})
export class BaseFrom<T extends { [K in keyof T]: AbstractControl<any, any> }> {
  constructor(public readonly form: FormGroup<T>) {}

  @Output() onFormValue = new EventEmitter();
  @Input() set errors(
    errorsObj: { [key: string]: ValidationErrors } | null | undefined
  ) {
    if (!errorsObj) {
      return;
    }

    setControlsErrors(this.form, errorsObj);
  }

  handleFormSubmit() {
    this.onFormValue.emit(this.form.value);
  }
}
