import { AfterViewInit, Directive } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AbstractControl } from '@angular/forms';
import { EMPTY, Observable, throwError } from 'rxjs';
import { ConversionMap } from 'src/app/common/classes/ConversionMap';
import { FirebaseErrorConversionInstruction } from '@common/classes/FirebaseErrorToFormErrorConversion';
import { FormActionBasedPage } from 'src/app/common/abstract/FormBasedPage';

@Directive()
export abstract class AuthPage<
    TForm extends Record<string, AbstractControl<any>>,
    TFormValue extends { [K in keyof TForm]: TForm[K]['value'] },
    TTaskResult
  >
  extends FormActionBasedPage<TForm, TFormValue, TTaskResult>
  implements AfterViewInit
{
  private readonly errorsConverter = new ConversionMap([
    ['auth/user-not-found', new FirebaseErrorConversionInstruction('email')],
    ['auth/wrong-password', new FirebaseErrorConversionInstruction('password')],
    [
      'auth/email-already-in-use',
      new FirebaseErrorConversionInstruction('email'),
    ],
    ['auth/user-disabled', new FirebaseErrorConversionInstruction('email')],
  ]);

  override handleError(error: unknown): Observable<never> {
    if (
      error instanceof FirebaseError &&
      this.errorsConverter.hasInstruction(error.code)
    ) {
      this.insertFormError(this.errorsConverter.convert(error, error.code));

      return EMPTY;
    } else {
      return throwError(() => error);
    }
  }
}
