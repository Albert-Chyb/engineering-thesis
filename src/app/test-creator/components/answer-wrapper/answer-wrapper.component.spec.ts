import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerWrapperComponent } from './answer-wrapper.component';

describe('AnswerWrapperComponent', () => {
  let component: AnswerWrapperComponent;
  let fixture: ComponentFixture<AnswerWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnswerWrapperComponent]
    });
    fixture = TestBed.createComponent(AnswerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
