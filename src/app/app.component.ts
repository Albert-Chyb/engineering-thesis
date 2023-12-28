import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { PendingIndicatorComponent } from '@loading-indicator/components/pending-indicator/pending-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PendingIndicatorComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  @ViewChild(PendingIndicatorComponent)
  pendingIndicatorComponent!: PendingIndicatorComponent;

  auth = inject(AuthService);
  isLoggedIn = toSignal(this.auth.isLoggedIn$);
  isMobileView = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(map((result) => result.matches)),
  );

  readonly mainNavRoutes = [
    {
      link: '/my-tests',
      icon: 'edit_note',
      title: 'Utworzone testy',
      description: 'Przeglądaj wersje robocze testów',
    },
    {
      link: '/shared-tests',
      icon: 'shared-tests',
      title: 'Udostępnione testy',
      description: 'Przeglądaj udostępnione publicznie testy',
    },
  ];

  ngAfterViewInit(): void {
    this.pendingIndicator.connectIndicator(this.pendingIndicatorComponent);
  }
}
