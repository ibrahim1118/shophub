import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../../core/services/product';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart';
import { WishlistService } from '../../../../core/services/wishlist';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

wishlistIds$ = this.wishlistService.wishlistIds$;


  product?: Product;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.loading = true;

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        this.product = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Product not found.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {

  if (!this.product) {
    return;
  }

  this.cartService.addToCart(this.product);

}

toggleWishlist(): void {

  if (!this.product) {
    return;
  }

  this.wishlistService.toggleWishlist(this.product);
}
}