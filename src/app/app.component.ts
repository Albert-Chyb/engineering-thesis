import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  auth = inject(AuthService);
  router = inject(Router);
  userTests = inject(UserTestsService);
  isLoggedIn = toSignal(this.auth.isLoggedIn$);

  createDummyTest() {
    const id = this.userTests.generateId();

    this.userTests
      .create(
        {
          name: 'Test bez nazwy',
        },
        id
      )
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigateByUrl('/test-creator/' + id);
      });
  }
}
