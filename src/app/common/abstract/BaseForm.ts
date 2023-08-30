import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { setControlsErrors } from '../helpers/setControlsErrors';

export type FormGroupErrorObject = { [key: string]: ValidationErrors };

@Directive({})
export class BaseFrom<
  TForm extends { [K in keyof TForm]: AbstractControl<any, any> },
  TFormValue extends { [K in keyof TForm]: TForm[K]['value'] }
> {
  constructor(public readonly form: FormGroup<TForm>) {}

  @Output() onFormValue = new EventEmitter<TFormValue>();
  @Input() set errors(errorsObj: FormGroupErrorObject | null | undefined) {
    if (!errorsObj) {
      return;
    }

    setControlsErrors(this.form, errorsObj);
  }

  handleFormSubmit() {
    this.onFormValue.emit(this.form.value as TFormValue);
  }
}
