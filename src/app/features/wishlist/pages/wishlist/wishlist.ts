import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../../../core/services/wishlist';

import {
  WishlistItem
} from '../../components/wishlist-item/wishlist-item';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    WishlistItem
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist {

  private wishlistService = inject(WishlistService);

  wishlistItems$ = this.wishlistService.wishlistItems$;

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }
}