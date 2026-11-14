import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../../../core/models/product.model';
import { WishlistService } from '../../../../core/services/wishlist';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist-item.html',
  styleUrl: './wishlist-item.scss'
})
export class WishlistItem {

  @Input({ required: true }) product!: Product;

  private wishlistService = inject(WishlistService);

  remove(): void {
    this.wishlistService.removeFromWishlist(this.product.id);
  }

  moveToCart(): void {
    this.wishlistService.moveToCart(this.product.id);
  }
}