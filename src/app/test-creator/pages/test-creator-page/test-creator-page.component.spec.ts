import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreatorPageComponent } from './test-creator-page.component';

describe('TestCreatorPageComponent', () => {
  let component: TestCreatorPageComponent;
  let fixture: ComponentFixture<TestCreatorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCreatorPageComponent]
    });
    fixture = TestBed.createComponent(TestCreatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
