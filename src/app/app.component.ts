import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { PendingIndicatorComponent } from '@loading-indicator/components/pending-indicator/pending-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, PendingIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private readonly pendingIndicator = inject(PendingIndicatorService);

  @ViewChild(PendingIndicatorComponent)
  pendingIndicatorComponent!: PendingIndicatorComponent;

  auth = inject(AuthService);
  router = inject(Router);
  isLoggedIn = toSignal(this.auth.isLoggedIn$);

  ngAfterViewInit(): void {
    this.pendingIndicator.connectIndicator(this.pendingIndicatorComponent);
  }
}
