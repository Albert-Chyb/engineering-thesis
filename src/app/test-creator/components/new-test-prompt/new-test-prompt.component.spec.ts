import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestPromptComponent } from './new-test-prompt.component';

describe('TestNamePromptComponent', () => {
  let component: NewTestPromptComponent;
  let fixture: ComponentFixture<NewTestPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTestPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTestPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
