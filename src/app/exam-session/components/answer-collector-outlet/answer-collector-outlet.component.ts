import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { Component, Injector, computed, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  ANSWER_COLLECTOR_FORM_REF_DI_TOKEN,
  ANSWER_COLLECTOR_QUESTION_DI_TOKEN,
} from '@exam-session/constants/answers-collectors-DI';
import { AnswersCollectorsService } from '@exam-session/services/answers-collectors.service';
import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';

@Component({
  selector: 'app-answer-collector-outlet',
  standalone: true,
  imports: [PortalModule, MatCardModule],
  templateUrl: './answer-collector-outlet.component.html',
  styleUrl: './answer-collector-outlet.component.scss',
})
export class AnswerCollectorOutletComponent<
  TQuestionType extends QuestionsTypes,
> {
  private readonly collectorsConfigs = inject(AnswersCollectorsService);
  private readonly injector = inject(Injector);

  readonly question = input.required<SharedTestQuestion<TQuestionType>>();
  readonly formRef = input.required<FormControl>();

  readonly collectorConfig = computed(() => {
    const question = this.question();
    const type = question.type as TQuestionType;

    return this.collectorsConfigs.get(type);
  });

  readonly CollectorComponentPortal = computed(() => {
    const config = this.collectorConfig();

    return new ComponentPortal(
      config.CollectorComponent,
      undefined,
      this.createInjector(),
    );
  });

  private createInjector() {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: ANSWER_COLLECTOR_QUESTION_DI_TOKEN,
          useValue: this.question,
        },
        {
          provide: ANSWER_COLLECTOR_FORM_REF_DI_TOKEN,
          useValue: this.formRef,
        },
      ],
    });
  }
}
