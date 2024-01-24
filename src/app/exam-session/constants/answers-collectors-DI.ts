import { InjectionToken, Provider, Signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AnswersCollectorConfig } from '@exam-session/types/answers-collectors';
import { SharedTestQuestion } from '@utils/firestore/models/shared-tests.model';

export const ANSWER_COLLECTOR_FORM_REF_DI_TOKEN = new InjectionToken<
  Signal<FormControl>
>('ANSWER_COLLECTOR_FORM_REF_DI_TOKEN');

export const ANSWER_COLLECTOR_QUESTION_DI_TOKEN = new InjectionToken<
  Signal<SharedTestQuestion>
>('ANSWER_COLLECTOR_QUESTION_DI_TOKEN');

export const ANSWERS_COLLECTORS_DI_TOKEN =
  new InjectionToken<AnswersCollectorConfig>('ANSWER_COLLECTORS_DI_TOKEN');

export function provideAnswersCollectors(
  config: AnswersCollectorConfig,
): Provider {
  return {
    provide: ANSWERS_COLLECTORS_DI_TOKEN,
    useValue: config,
  };
}
