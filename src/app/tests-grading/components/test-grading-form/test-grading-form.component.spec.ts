import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGradingFormComponent } from './test-grading-form.component';

describe('TestGradingFormComponent', () => {
  let component: TestGradingFormComponent;
  let fixture: ComponentFixture<TestGradingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGradingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestGradingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
