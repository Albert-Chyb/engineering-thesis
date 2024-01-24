import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AnswerCollectorDirective } from '@exam-session/directives/answer-collector.directive';

@Component({
  selector: 'app-text-answer-collector',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './text-answer-collector.component.html',
  styleUrl: './text-answer-collector.component.scss',
})
export class TextAnswerCollectorComponent extends AnswerCollectorDirective<'text-answer'> {}
