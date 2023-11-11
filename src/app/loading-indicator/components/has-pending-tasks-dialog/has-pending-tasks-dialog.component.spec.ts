import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasPendingTasksDialogComponent } from './has-pending-tasks-dialog.component';

describe('HasPendingTasksDialogComponent', () => {
  let component: HasPendingTasksDialogComponent;
  let fixture: ComponentFixture<HasPendingTasksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HasPendingTasksDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HasPendingTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
