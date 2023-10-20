import { AbstractControl, FormArray } from '@angular/forms';
import { LocalController } from '@db-auto-sync/abstract/local-controller';

export class FormArrayLocalController<
  TObj extends AbstractControl<any, any>
> extends LocalController<TObj> {
  constructor(private readonly formArrayRef: FormArray<TObj>) {
    super();
  }
  override push(obj: TObj): void {
    this.formArrayRef.push(obj);
  }

  override findIndex(predicate: (obj: TObj) => boolean): number {
    return this.formArrayRef.controls.findIndex((control) =>
      predicate(control as TObj)
    );
  }

  override insert(obj: TObj, index: number): void {
    this.formArrayRef.insert(index, obj);
  }

  override removeAt(index: number): void {
    this.formArrayRef.removeAt(index);
  }

  override at(index: number): TObj {
    return this.formArrayRef.at(index) as TObj;
  }
}
