import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreatorFormComponent } from './test-creator-form.component';

describe('TestCreatorFormComponent', () => {
  let component: TestCreatorFormComponent;
  let fixture: ComponentFixture<TestCreatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreatorFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestCreatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
