import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { PageComponent } from '@common/components/page/page.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { SubmissionsListComponentStore } from './submissions-list.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    RouterModule,
    PageComponent,
  ],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss',
  providers: [
    SubmissionsListComponentStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: SubmissionsListComponentStore,
    },
  ],
})
export class SubmissionsListComponent {
  private readonly store = inject(SubmissionsListComponentStore);

  readonly submissions = this.store.submissions;

  constructor() {
    this.store.load();
  }
}
