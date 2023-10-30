import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceQuestionComponent } from './multi-choice-question.component';

describe('MultiChoiceQuestionComponent', () => {
  let component: MultiChoiceQuestionComponent;
  let fixture: ComponentFixture<MultiChoiceQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MultiChoiceQuestionComponent]
    });
    fixture = TestBed.createComponent(MultiChoiceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
