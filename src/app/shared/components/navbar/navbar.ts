import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly cartCount = signal(0);

  constructor(private readonly router: Router) {}

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected onSearch(): void {
    const query = this.searchQuery().trim();
    void this.router.navigate(['/products'], {
      queryParams: query ? { q: query } : {},
    });
    this.closeMenu();
  }
}

