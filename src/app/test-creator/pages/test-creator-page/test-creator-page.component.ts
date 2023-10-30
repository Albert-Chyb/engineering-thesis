import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MultiChoiceQuestionComponent } from '@test-creator/components/multi-choice-question/multi-choice-question.component';
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { SingleChoiceQuestionComponent } from '@test-creator/components/single-choice-question/single-choice-question.component';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { debounceTime, map, tap } from 'rxjs';
import { TestCreatorPageStore } from './test-creator-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SingleChoiceQuestionComponent,
    MultiChoiceQuestionComponent,
    OpenQuestionComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
  providers: [TestCreatorPageStore],
})
export class TestCreatorPageComponent {
  private readonly store = inject(TestCreatorPageStore);
  private readonly route = inject(ActivatedRoute);

  readonly test = this.store.test;

  readonly testForm = new FormGroup({
    name: new FormControl(''),
  });

  private readonly syncStoreWithForm = effect(() => {
    const test = this.store.test();

    if (!test) {
      return;
    }

    this.testForm.patchValue(test, { emitEvent: false });
  });

  constructor() {
    this.store.loadTestData(
      this.route.params.pipe(map((params) => params['id']))
    );

    this.store.saveTest(
      this.testForm.valueChanges.pipe(
        map((value) => ({
          id: this.test()?.id ?? '',
          name: value.name ?? '',
        })),
        tap((value) => this.store.updateTest(value)),
        debounceTime(500)
      )
    );
  }

  handleAnswersReorder<TQuestionType extends ClosedQuestionsTypes>(
    $event: AnswersReorderEvent<TQuestionType>
  ) {}

  handleAddAnswer(index: number) {}

  handleDeleteAnswer([questionIndex, answerIndex]: [number, number]) {}
}
