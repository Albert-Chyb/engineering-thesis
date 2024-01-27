import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  MatDrawerMode,
  MatSidenav,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  exportAs: 'sidenav',
})
export class SidenavComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly mainNavRoutes = [
    {
      link: '/my-tests',
      icon: 'edit_note',
      title: 'Utworzone testy',
    },
    {
      link: '/shared-tests',
      icon: 'shared-tests',
      title: 'Udostępnione testy',
    },
    {
      link: '/submissions-list',
      icon: 'assignment_turned_in',
      title: 'Moje wyniki',
    },
  ];

  readonly sidenavWidth = 250;
  readonly maxViewPortWidth = 1320;
  readonly sidenavMode = toSignal<MatDrawerMode>(
    this.breakpointObserver
      .observe(`(min-width: ${this.maxViewPortWidth + this.sidenavWidth}px)`)
      .pipe(
        map((result) => result.matches),
        map((isEnoughSpace) => (isEnoughSpace ? 'side' : 'over')),
      ),
  );

  constructor() {
    effect(() => {
      const mode = this.sidenavMode();

      if (mode === 'over') {
        // If there isn't enough space for sidenav, close it.
        this.sidenavRef?.close();
      } else {
        // If there is enough space for sidenav, open it.
        this.sidenavRef?.open();
      }
    });
  }

  @ViewChild(MatSidenav) sidenavRef: MatSidenav | null = null;

  toggle() {
    this.sidenavRef?.toggle();
  }
}
