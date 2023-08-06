import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryFormComponent } from './password-recovery-form.component';

describe('PasswordRecoveryFormComponent', () => {
  let component: PasswordRecoveryFormComponent;
  let fixture: ComponentFixture<PasswordRecoveryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordRecoveryFormComponent]
    });
    fixture = TestBed.createComponent(PasswordRecoveryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
