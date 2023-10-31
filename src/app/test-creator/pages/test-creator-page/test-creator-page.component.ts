import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { MultiChoiceQuestionComponent } from '@test-creator/components/multi-choice-question/multi-choice-question.component';
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { QuestionWrapperComponent } from '@test-creator/components/question-wrapper/question-wrapper.component';
import { SingleChoiceQuestionComponent } from '@test-creator/components/single-choice-question/single-choice-question.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { Question } from '@test-creator/types/question';
import { QuestionsTypes } from '@test-creator/types/questions';
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
    MatIconModule,
    MatMenuModule,
    QuestionWrapperComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
  providers: [TestCreatorPageStore],
})
export class TestCreatorPageComponent {
  private readonly testsService = inject(UserTestsService);
  private readonly store = inject(TestCreatorPageStore);
  private readonly route = inject(ActivatedRoute);

  readonly test = this.store.test;
  readonly questions = this.store.questions;

  readonly testForm = new FormGroup({
    name: new FormControl(''),
  });

  readonly questionsTypes: {
    type: QuestionsTypes;
    label: string;
    shortLabel: string;
    icon: string;
  }[] = [
    {
      type: 'single-choice',
      label: 'Pytanie jednokrotnego wyboru',
      shortLabel: 'Jednokrotny wybór',
      icon: 'radio_button_checked',
    },
    {
      type: 'multi-choice',
      label: 'Pytanie wielokrotnego wyboru',
      shortLabel: 'Wielokrotny wybór',
      icon: 'check_box',
    },
    {
      type: 'text-answer',
      label: 'Pytanie otwarte',
      shortLabel: 'Otwarte',
      icon: 'text_fields',
    },
  ];

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

  getQuestionLabel(type: QuestionsTypes) {
    return this.questionsTypes.find(
      (questionType) => questionType.type === type
    )?.label;
  }

  handleAddQuestion<TQuestionType extends QuestionsTypes>(type: TQuestionType) {
    const newQuestion: Question<TQuestionType> = {
      id: this.testsService.generateId(),
      type,
      content: 'Nowe pytanie',
    };

    this.store.addQuestion(newQuestion);
    this.store.saveQuestion(newQuestion);
  }

  trackByQuestionId(index: number, question: Question<QuestionsTypes>) {
    return question.id;
  }
}
