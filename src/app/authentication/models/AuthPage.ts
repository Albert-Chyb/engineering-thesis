import { AfterViewInit, Directive } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AbstractControl } from '@angular/forms';
import { EMPTY, Observable, throwError } from 'rxjs';
import { ConversionMap } from 'src/app/common/ConversionMap';
import { FirebaseErrorConversionInstruction } from 'src/app/common/FirebaseErrorToFormErrorConversion';
import { FormActionBasedPage } from 'src/app/common/FormBasedPage';

@Directive()
export abstract class AuthPage<
    TForm extends Record<string, AbstractControl<any>>,
    TFormValue,
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
