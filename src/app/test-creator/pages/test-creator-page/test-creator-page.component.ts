import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ChoiceQuestionComponent } from '@test-creator/components/choice-question/choice-question.component';
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { map } from 'rxjs';
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
    ChoiceQuestionComponent,
    OpenQuestionComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
  providers: [TestCreatorPageStore],
})
export class TestCreatorPageComponent {
  private readonly store = inject(TestCreatorPageStore);
  private readonly route = inject(ActivatedRoute);
  
  readonly testForm = new FormGroup({
    name: new FormControl(''),
    questions: new FormArray([]),
  }) as any;

  constructor() {
    this.store.loadTestData(
      this.route.params.pipe(map((params) => params['id']))
    );
  }

  handleAnswersReorder<TQuestionType extends ClosedQuestionsTypes>(
    $event: AnswersReorderEvent<TQuestionType>
  ) {}

  handleAddAnswer(index: number) {}

  handleDeleteAnswer([questionIndex, answerIndex]: [number, number]) {}
}
