import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { setControlsErrors } from './setControlsErrors';

export type FormGroupErrorObject = { [key: string]: ValidationErrors };


@Directive({})
export class BaseFrom<
  T extends { [K in keyof T]: AbstractControl<any, any> },
  EmitterValue
> {
  constructor(public readonly form: FormGroup<T>) {}

  @Output() onFormValue = new EventEmitter<EmitterValue>();
  @Input() set errors(errorsObj: FormGroupErrorObject | null | undefined) {
    if (!errorsObj) {
      return;
    }

    setControlsErrors(this.form, errorsObj);
  }

  handleFormSubmit() {
    this.onFormValue.emit(this.form.value as EmitterValue);
  }
}
