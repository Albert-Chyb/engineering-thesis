import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestActionsBottomSheetComponent } from './test-actions-bottom-sheet.component';

describe('TestActionsBottomSheetComponent', () => {
  let component: TestActionsBottomSheetComponent;
  let fixture: ComponentFixture<TestActionsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestActionsBottomSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestActionsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
