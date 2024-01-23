import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentDirective } from '@common/directives/document.directive';
import { TestForm } from '@test-creator/types/test-creator-form';
import { Test } from '@utils/firestore/models/tests.model';

@Component({
  selector: 'app-test-creator-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './test-creator-form.component.html',
  styleUrl: './test-creator-form.component.scss',
})
export class TestCreatorFormComponent extends DocumentDirective<
  Test,
  TestForm['controls']
> {
  constructor() {
    super(
      new FormGroup({
        name: new FormControl('', { nonNullable: true }),
      }),
    );
  }

  override convertFormToDoc(value: Partial<{ name: string }>): Test {
    const test = this.document();

    if (!test) {
      throw new Error('Test is not defined');
    }

    return {
      id: test.id,
      name: value.name as string,
    };
  }
}
