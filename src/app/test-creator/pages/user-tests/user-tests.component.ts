import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserTestsStore } from './user-tests.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.scss',
  providers: [UserTestsStore],
})
export class UserTestsComponent {
  private readonly store = inject(UserTestsStore);
}
