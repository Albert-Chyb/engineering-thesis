import { FirebaseError } from '@angular/fire/app';
import { FormGroupErrorObject } from './BaseForm';
import { Instruction } from './ConversionMap';
import { kebabToCamel } from './kebabToCamel';

export class FirebaseErrorConversionInstruction
  implements Instruction<FirebaseError, FormGroupErrorObject>
{
  constructor(private readonly formControlName: string) {}

  transform(s: FirebaseError): FormGroupErrorObject {
    const [, errorName] = s.code.split('/');

    return {
      [this.formControlName]: {
        [kebabToCamel(errorName)]: true,
      },
    };
  }
}
