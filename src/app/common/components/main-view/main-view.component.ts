import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobileView = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(map((result) => result.matches)),
  );
}
