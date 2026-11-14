import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartItem } from '../../../../core/models/cart-item.model';
import { CartService } from '../../../../core/services/cart';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {

  @Input({ required: true }) item!: CartItem;

  private cartService = inject(CartService);

  increase(): void {
    this.cartService.increaseQuantity(this.item.product.id);
  }

  decrease(): void {
    this.cartService.decreaseQuantity(this.item.product.id);
  }

  remove(): void {
    this.cartService.removeFromCart(this.item.product.id);
  }
}