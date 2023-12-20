import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AssembledQuestion } from '@test-creator/types/assembled-test';

@Component({
  selector: 'app-multi-choice-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './multi-choice-question.component.html',
  styleUrl: './multi-choice-question.component.scss',
})
export class MultiChoiceQuestionComponent implements OnInit {
  @Input({ required: true }) question!: AssembledQuestion;
  @Input({ required: true }) formControl!: FormControl<string[] | null>;

  readonly checkboxesForm = new FormGroup<
    Record<string, FormControl<boolean | null>>
  >({});

  constructor() {
    this.checkboxesForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((checkboxes) => {
        const selectedAnswers = this.extractSelectedAnswers(
          checkboxes as Record<string, boolean | null>,
        );

        this.formControl.setValue(selectedAnswers);
      });
  }

  ngOnInit(): void {
    this.setControls();
  }

  private setControls() {
    const controls = this.buildControls();

    for (const key in controls) {
      this.checkboxesForm.setControl(key, controls[key], {
        emitEvent: false,
      });
    }
  }

  private buildControls(): Record<string, FormControl<boolean | null>> {
    const controls = this.question.answers.reduce(
      (acc, current) => {
        acc[current.id] = new FormControl(
          this.formControl.value?.includes(current.id) ?? null,
        );

        return acc;
      },
      {} as Record<string, FormControl<boolean | null>>,
    );

    return controls;
  }

  private extractSelectedAnswers(
    value: Record<string, boolean | null>,
  ): string[] {
    const selectedAnswers = Object.entries(value)
      .filter(([, value]) => value)
      .map(([key]) => key);

    return selectedAnswers;
  }
}
