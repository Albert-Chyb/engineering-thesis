import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { take } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {}

  logout() {
    this.auth
      .signOut()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
