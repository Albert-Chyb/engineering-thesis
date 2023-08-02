import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({})
export class BaseFrom<T extends { [K in keyof T]: AbstractControl<any, any> }> {
  constructor(public readonly form: FormGroup<T>) {}

  @Output() onFormValue = new EventEmitter();
  @Input() error = '';

  handleFormSubmit() {
    this.onFormValue.emit(this.form.value);
  }
}
