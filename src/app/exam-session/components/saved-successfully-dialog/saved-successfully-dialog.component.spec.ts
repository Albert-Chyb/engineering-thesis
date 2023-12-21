import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSuccessfullyDialogComponent } from './saved-successfully-dialog.component';

describe('SavedSuccessfullyDialogComponent', () => {
  let component: SavedSuccessfullyDialogComponent;
  let fixture: ComponentFixture<SavedSuccessfullyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedSuccessfullyDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedSuccessfullyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
