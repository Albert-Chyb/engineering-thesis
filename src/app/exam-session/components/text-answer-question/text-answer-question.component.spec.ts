import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnswerQuestionComponent } from './text-answer-question.component';

describe('TextAnswerQuestionComponent', () => {
  let component: TextAnswerQuestionComponent;
  let fixture: ComponentFixture<TextAnswerQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnswerQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextAnswerQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
