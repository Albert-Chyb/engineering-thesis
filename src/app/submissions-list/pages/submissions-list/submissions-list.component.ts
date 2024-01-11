import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { SubmissionsListComponentStore } from './submissions-list.store';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageStatesDirective,
    MatCardModule,
    LoadingIndicatorComponent,
    NoDataInfoComponent
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
export class SubmissionsListComponent {}
