import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTakerInfoComponent } from './test-taker-info.component';

describe('TestTakerInfoComponent', () => {
  let component: TestTakerInfoComponent;
  let fixture: ComponentFixture<TestTakerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTakerInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTakerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
