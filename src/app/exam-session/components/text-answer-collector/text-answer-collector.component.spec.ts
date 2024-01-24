import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnswerCollectorComponent } from './text-answer-collector.component';

describe('TextAnswerCollectorComponent', () => {
  let component: TextAnswerCollectorComponent;
  let fixture: ComponentFixture<TextAnswerCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnswerCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextAnswerCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
