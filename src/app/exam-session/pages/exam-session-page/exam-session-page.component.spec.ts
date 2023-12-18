import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSessionPageComponent } from './exam-session-page.component';

describe('ExamSessionPageComponent', () => {
  let component: ExamSessionPageComponent;
  let fixture: ComponentFixture<ExamSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSessionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
