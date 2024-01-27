import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@common/components/header/header.component';
import { MainViewComponent } from '@common/components/main-view/main-view.component';
import { SidenavComponent } from '@common/components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidenavComponent,
    HeaderComponent,
    RouterModule,
    MainViewComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
