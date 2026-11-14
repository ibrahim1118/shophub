import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink, RouterLinkActive, AsyncPipe],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);
  protected readonly isUserMenuOpen = signal(false);
  protected readonly searchQuery = signal('');

  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  protected readonly currentUser$ = this.authService.currentUser$;
  protected readonly cartCount$ = this.cartService.cartCount$;
  protected readonly wishlistCount$ = this.wishlistService.wishlistCount$;

  constructor(private readonly router: Router) {}

  @HostListener('document:click')
  protected closeUserMenuOnOutsideClick(): void {
    this.isUserMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeMenusOnEscape(): void {
    this.closeMenu();
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
    this.isUserMenuOpen.set(false);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  protected toggleUserMenu(): void {
    this.isUserMenuOpen.update((open) => !open);
  }

  protected closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  protected onSearch(): void {
    const query = this.searchQuery().trim();
    void this.router.navigate(['/products'], {
      queryParams: query ? { q: query } : {},
    });
    this.closeMenu();
  }

  protected logout(): void {
    this.authService.logout();
    this.closeMenu();
    void this.router.navigate(['/login']);
  }
}
