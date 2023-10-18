import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { LocalController } from '@db-auto-sync/abstract/local-controller';

export class FormArrayLocalController<
  TControl extends {
    [K in keyof TControl]: AbstractControl<any, any>;
  }
> extends LocalController<FormGroup<TControl>> {
  constructor(private readonly formArrayRef: FormArray<FormGroup<TControl>>) {
    super();
  }
  override push(obj: FormGroup<TControl>): void {
    this.formArrayRef.push(obj);
  }

  override findIndex(predicate: (obj: FormGroup<TControl>) => boolean): number {
    return this.formArrayRef.controls.findIndex(predicate);
  }

  override insert(obj: FormGroup<TControl>, index: number): void {
    this.formArrayRef.insert(index, obj);
  }

  override removeAt(index: number): void {
    this.formArrayRef.removeAt(index);
  }

  override at(index: number): FormGroup<TControl> {
    return this.formArrayRef.at(index);
  }
}
