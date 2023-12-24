import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGradingPageComponent } from './test-grading-page.component';

describe('TestGradingPageComponent', () => {
  let component: TestGradingPageComponent;
  let fixture: ComponentFixture<TestGradingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGradingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestGradingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
