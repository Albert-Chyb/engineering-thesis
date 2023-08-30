import { FormGroup, ValidationErrors } from '@angular/forms';

export function setControlsErrors(
  formGroup: FormGroup,
  errors: { [key: string]: ValidationErrors }
): void {
  for (const controlName in errors) {
    const control = formGroup.get(controlName);
    const validationErrors = errors[controlName];

    control?.setErrors(validationErrors);
  }
}
