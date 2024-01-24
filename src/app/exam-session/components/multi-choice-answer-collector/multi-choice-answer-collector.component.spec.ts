import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceAnswerCollectorComponent } from './multi-choice-answer-collector.component';

describe('MultiChoiceAnswerCollectorComponent', () => {
  let component: MultiChoiceAnswerCollectorComponent;
  let fixture: ComponentFixture<MultiChoiceAnswerCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiChoiceAnswerCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiChoiceAnswerCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
