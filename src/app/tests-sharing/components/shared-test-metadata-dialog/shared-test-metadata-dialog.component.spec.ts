import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTestMetadataDialogComponent } from './shared-test-metadata-dialog.component';

describe('SharedTestMetadataDialogComponent', () => {
  let component: SharedTestMetadataDialogComponent;
  let fixture: ComponentFixture<SharedTestMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestMetadataDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedTestMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
