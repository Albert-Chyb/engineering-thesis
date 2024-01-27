import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { PendingIndicatorComponent } from '@utils/loading-indicator/components/pending-indicator/pending-indicator.component';
import { PendingIndicatorService } from '@utils/loading-indicator/services/pending-indicator.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PendingIndicatorComponent,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly pendingIndicator = inject(PendingIndicatorService);

  @Output() onHamburgerClick = new EventEmitter<void>();

  @ViewChild(PendingIndicatorComponent)
  pendingIndicatorComponent!: PendingIndicatorComponent;

  readonly isLoggedIn = toSignal(this.auth.isLoggedIn$);

  ngAfterViewInit(): void {
    this.pendingIndicator.connectIndicator(this.pendingIndicatorComponent);
  }
}
