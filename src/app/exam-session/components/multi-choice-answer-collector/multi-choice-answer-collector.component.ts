import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AnswerCollectorDirective } from '@exam-session/directives/answer-collector.directive';

@Component({
  selector: 'app-multi-choice-answer-collector',
  standalone: true,
  imports: [ReactiveFormsModule, MatListModule],
  templateUrl: './multi-choice-answer-collector.component.html',
  styleUrl: './multi-choice-answer-collector.component.scss',
})
export class MultiChoiceAnswerCollectorComponent extends AnswerCollectorDirective<'multi-choice'> {}
