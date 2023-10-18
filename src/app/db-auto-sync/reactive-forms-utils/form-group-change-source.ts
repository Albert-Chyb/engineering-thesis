import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChangeSource } from '@db-auto-sync/abstract/change-source';
import { debounceTime, filter, map } from 'rxjs';

export class FormGroupChangeSource<
  TFormGroup extends FormGroup,
  TKeysToExclude extends keyof TFormGroup['controls']
> extends ChangeSource<TFormGroup> {
  constructor(
    private readonly formGroup: TFormGroup,
    private readonly excludedKeys: TKeysToExclude[] = []
  ) {
    super();
  }

  get valueChanges() {
    return this.formGroup.valueChanges.pipe(
      map(() => ({
        value: this.extendFormGroup(
          this.copyFormGroup(this.formGroup),
          this.excludedKeys
        ),
        valid: this.formGroup.valid,
      })),
      filter(({ valid }) => valid),
      map(({ value }) => value),
      debounceTime(300)
    );
  }

  override restoreValue(formGroup: TFormGroup): void {
    this.formGroup.patchValue(formGroup.value);
  }

  override get value(): TFormGroup {
    return this.copyFormGroup(this.formGroup);
  }

  override get forLocalController(): TFormGroup {
    return this.formGroup;
  }

  private copyFormGroup(
    formGroup: FormGroup<Omit<TFormGroup['controls'], TKeysToExclude>>
  ) {
    return new FormGroup(
      Object.entries(formGroup.controls).reduce((acc, curr) => {
        const [key, control] = curr;

        return { ...acc, [key]: new FormControl(control.value) };
      }, {} as any),
      formGroup.validator,
      formGroup.asyncValidator
    ) as TFormGroup;
  }

  private extendFormGroup<
    TFormGroup extends FormGroup,
    TKeysToExclude extends keyof TFormGroup['controls'],
    TIncludedKeys extends keyof TFormGroup['controls'] = Exclude<
      keyof TFormGroup['controls'],
      TKeysToExclude
    >
  >(formGroup: TFormGroup, excludedKeys: TKeysToExclude[]): TFormGroup {
    const control: {
      [K in TIncludedKeys]: AbstractControl<TFormGroup['controls'][K]['value']>;
    } = {} as any;

    for (const key in formGroup.controls) {
      const k = key as TKeysToExclude;

      if (!excludedKeys.includes(k)) {
        const k = key as TIncludedKeys;

        control[k] = formGroup.controls[key];
      }
    }

    return new FormGroup<Omit<TFormGroup['controls'], TKeysToExclude>>(
      control as any
    ) as TFormGroup;
  }
}
