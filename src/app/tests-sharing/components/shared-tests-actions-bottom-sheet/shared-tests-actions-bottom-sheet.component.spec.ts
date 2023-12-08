import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTestsActionsBottomSheetComponent } from './shared-tests-actions-bottom-sheet.component';

describe('SharedTestsActionsBottomSheetComponent', () => {
  let component: SharedTestsActionsBottomSheetComponent;
  let fixture: ComponentFixture<SharedTestsActionsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestsActionsBottomSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedTestsActionsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
