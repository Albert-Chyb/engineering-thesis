import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerCollectorOutletComponent } from './answer-collector-outlet.component';

describe('AnswerCollectorOutletComponent', () => {
  let component: AnswerCollectorOutletComponent;
  let fixture: ComponentFixture<AnswerCollectorOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerCollectorOutletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerCollectorOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
