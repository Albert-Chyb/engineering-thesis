import { FirebaseError } from '@angular/fire/app';
import { Instruction } from './ConversionMap';
import { FormGroupErrorObject } from '../abstract/BaseForm';
import { kebabToCamel } from '../helpers/kebabToCamel';

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
