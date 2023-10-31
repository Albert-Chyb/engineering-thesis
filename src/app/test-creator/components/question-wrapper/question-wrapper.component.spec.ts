import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionWrapperComponent } from './question-wrapper.component';

describe('QuestionWrapperComponent', () => {
  let component: QuestionWrapperComponent;
  let fixture: ComponentFixture<QuestionWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionWrapperComponent]
    });
    fixture = TestBed.createComponent(QuestionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
