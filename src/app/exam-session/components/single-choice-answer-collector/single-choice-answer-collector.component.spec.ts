import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceAnswerCollectorComponent } from './single-choice-answer-collector.component';

describe('SingleChoiceAnswerCollectorComponent', () => {
  let component: SingleChoiceAnswerCollectorComponent;
  let fixture: ComponentFixture<SingleChoiceAnswerCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleChoiceAnswerCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleChoiceAnswerCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
