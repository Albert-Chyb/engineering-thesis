import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  exportAs: 'sidenav',
})
export class SidenavComponent {
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

  @ViewChild(MatSidenav) sidenavRef: MatSidenav | null = null;

  toggle() {
    this.sidenavRef?.toggle();
  }
}
