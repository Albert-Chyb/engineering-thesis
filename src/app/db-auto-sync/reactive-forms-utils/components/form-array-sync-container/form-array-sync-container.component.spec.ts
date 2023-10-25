import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArraySyncContainerComponent } from './form-array-sync-container.component';

describe('FormArraySyncContainerComponent', () => {
  let component: FormArraySyncContainerComponent;
  let fixture: ComponentFixture<FormArraySyncContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormArraySyncContainerComponent]
    });
    fixture = TestBed.createComponent(FormArraySyncContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
