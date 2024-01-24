import { ComponentType } from '@angular/cdk/portal';
import { AnswerCollectorDirective } from '@exam-session/directives/answer-collector.directive';
import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import {
  MultipleChoiceAnswer,
  SingleChoiceAnswer,
  TextAnswerAnswer,
} from '@utils/firestore/models/user-answers.model';

type Config = {
  'single-choice': {
    answerShape: SingleChoiceAnswer;
  };
  'multi-choice': {
    answerShape: MultipleChoiceAnswer;
  };
  'text-answer': {
    answerShape: TextAnswerAnswer;
  };
};

export type AnswerCollectorConfig<TQuestionType extends QuestionsTypes> = {
  abstractInstruction: string;
  CollectorComponent: ComponentType<AnswerCollectorDirective<TQuestionType>>;
};

export type AnswersCollectorConfig = {
  [TQuestionType in QuestionsTypes]: AnswerCollectorConfig<TQuestionType>;
};

export type AnswerShape<TQuestionType extends QuestionsTypes> =
  Config[TQuestionType]['answerShape'];
