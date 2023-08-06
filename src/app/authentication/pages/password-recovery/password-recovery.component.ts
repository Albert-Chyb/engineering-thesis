import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PasswordRecoveryFormComponent } from '../../components/password-recovery-form/password-recovery-form.component';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, PasswordRecoveryFormComponent],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent {}
