import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsyncPipe],
  styleUrl: './admin-dashboard.scss',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  protected readonly currentUser$ = inject(AuthService).currentUser$;
}
