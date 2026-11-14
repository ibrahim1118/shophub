import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth';
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class App {
  private readonly authService = inject(AuthService);

  constructor() {
    // Browser only: restore a persisted session after hydration so the server
    // and client render the same initial markup.
    afterNextRender(() => this.authService.loadCurrentUser());
  }
}
