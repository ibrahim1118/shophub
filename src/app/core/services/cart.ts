import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'shophub_cart';

  // Restore saved cart when the service is initialized
  private cartSubject = new BehaviorSubject<CartItem[]>(
    this.loadCart()
  );

  // Observable cart state
  cartItems$ = this.cartSubject.asObservable();

  // Total number of individual units in cart
  cartCount$ = this.cartItems$.pipe(
    map(items =>
      items.reduce((total, item) => total + item.quantity, 0)
    )
  );

  // Subtotal before shipping or taxes
  subtotal$ = this.cartItems$.pipe(
    map(items =>
      items.reduce(
        (total, item) =>
          total + item.product.price * item.quantity,
        0
      )
    )
  );

  // Initial project has no shipping charge or tax
  total$ = this.subtotal$;

  // Get current cart items synchronously
  get cartItems(): CartItem[] {
    return this.cartSubject.value;
  }

  // Add product
  addToCart(product: Product): void {

    const items = [...this.cartItems];

    const existingItem = items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.push({
        product,
        quantity: 1
      });
    }

    this.updateCart(items);
  }

  // Remove product
  removeFromCart(productId: number): void {

    const items = this.cartItems.filter(
      item => item.product.id !== productId
    );

    this.updateCart(items);
  }

  // Increase quantity
  increaseQuantity(productId: number): void {

    const items = this.cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    this.updateCart(items);
  }

  // Decrease quantity
  decreaseQuantity(productId: number): void {

    const items = this.cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );

    this.updateCart(items);
  }

  // Clear cart
  clearCart(): void {
    this.updateCart([]);
  }

  // Update cart and save it
  private updateCart(items: CartItem[]): void {

    this.cartSubject.next(items);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(items)
    );
  }

  // Load cart from LocalStorage
  private loadCart(): CartItem[] {

    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) as CartItem[] : [];

    } catch (error) {

      console.error('Could not restore cart:', error);

      return [];
    }
  }

  getCartItems(): CartItem[] {
  return this.cartSubject.value;
}

getSubtotal(): number {
  return this.getCartItems().reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );
}
}