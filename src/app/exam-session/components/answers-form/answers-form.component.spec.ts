import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersFormComponent } from './answers-form.component';

describe('AnswersFormComponent', () => {
  let component: AnswersFormComponent;
  let fixture: ComponentFixture<AnswersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswersFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
