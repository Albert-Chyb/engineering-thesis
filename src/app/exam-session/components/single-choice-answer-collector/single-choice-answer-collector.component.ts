import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AnswerCollectorDirective } from '@exam-session/directives/answer-collector.directive';

@Component({
  selector: 'app-single-choice-answer-collector',
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule],
  templateUrl: './single-choice-answer-collector.component.html',
  styleUrl: './single-choice-answer-collector.component.scss',
})
export class SingleChoiceAnswerCollectorComponent extends AnswerCollectorDirective<'single-choice'> {}
