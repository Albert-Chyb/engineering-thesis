import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@common/components/header/header.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobileView = toSignal(
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
    {
      link: '/submissions-list',
      icon: 'assignment_turned_in',
      title: 'Moje wyniki',
      description: 'Przeglądaj wyniki rozwiązanych testów',
    },
  ];
}
