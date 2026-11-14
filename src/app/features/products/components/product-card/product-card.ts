import { Component, Input, inject } from '@angular/core';

import type { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart';
import { WishlistService } from '../../../../core/services/wishlist';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports : [AsyncPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {

  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

wishlistIds$ = this.wishlistService.wishlistIds$;

toggleWishlist(): void {
  this.wishlistService.toggleWishlist(this.product);
}

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}