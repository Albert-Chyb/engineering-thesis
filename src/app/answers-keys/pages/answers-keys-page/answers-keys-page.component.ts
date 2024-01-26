import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { PageComponent } from '@common/components/page/page.component';
import { AnswersFormComponent } from '@exam-session/components/answers-form/answers-form.component';
import { UserAnswersSchema } from '@utils/firestore/models/user-answers.model';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { filter, map } from 'rxjs';
import { AnswersKeysPageStore } from './answers-keys-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    NoDataInfoComponent,
    AnswersFormComponent,
    PageComponent,
  ],
  templateUrl: './answers-keys-page.component.html',
  styleUrl: './answers-keys-page.component.scss',
  providers: [
    AnswersKeysPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: AnswersKeysPageStore,
    },
  ],
})
export class AnswersKeysPageComponent {
  private readonly store = inject(AnswersKeysPageStore);
  private readonly route = inject(ActivatedRoute);

  readonly answersKeysForm = new FormGroup({});

  readonly answersKeys = this.store.answersKeys;

  readonly sharedTestQuestions = this.store.questions;

  constructor() {
    this.store.saveAnswersKeys(this.buildAnswersKeysStream());
    this.store.load(this.buildParamsStream());
  }

  private buildAnswersKeysStream() {
    return this.answersKeysForm.valueChanges.pipe(
      filter(() => this.answersKeysForm.dirty && this.answersKeysForm.valid),
      map((answersKeys) => UserAnswersSchema.parse(answersKeys)),
    );
  }

  private buildParamsStream() {
    return this.route.paramMap.pipe(
      map((params) => {
        const sharedTestId = params.get('sharedTestId');

        if (!sharedTestId) {
          throw new Error('sharedTestId is not defined');
        }

        return sharedTestId;
      }),
    );
  }
}
