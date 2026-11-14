import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart';

import {
  CartItemComponent
} from '../../components/cart-item/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CartItemComponent
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {

  private cartService = inject(CartService);

  cartItems$ = this.cartService.cartItems$;
  subtotal$ = this.cartService.subtotal$;
  total$ = this.cartService.total$;

  clearCart(): void {
    this.cartService.clearCart();
  }
}