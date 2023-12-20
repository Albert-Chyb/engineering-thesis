import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTakerNameComponent } from './test-taker-name.component';

describe('TestTakerNameComponent', () => {
  let component: TestTakerNameComponent;
  let fixture: ComponentFixture<TestTakerNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTakerNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTakerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
