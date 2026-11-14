import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Product } from '../models/product.model';
import { CartService } from './cart';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly STORAGE_KEY = 'shophub_wishlist';

  private wishlistSubject = new BehaviorSubject<Product[]>(
    this.loadWishlist()
  );

  // Observable wishlist state
  wishlistItems$ = this.wishlistSubject.asObservable();

  // Number of favorite products
  wishlistCount$ = this.wishlistItems$.pipe(
    map(products => products.length)
  );

  // A reactive collection of favorite product IDs
  wishlistIds$ = this.wishlistItems$.pipe(
    map(products => new Set(products.map(product => product.id)))
  );

  private cartService = inject(CartService);

  constructor() {}

  // Get current wishlist synchronously
  get wishlistItems(): Product[] {
    return this.wishlistSubject.value;
  }

  // Add product
  addToWishlist(product: Product): void {

    const alreadyExists = this.isInWishlist(product.id);

    if (alreadyExists) {
      return;
    }

    const updatedWishlist = [
      ...this.wishlistItems,
      product
    ];

    this.updateWishlist(updatedWishlist);
  }

  // Remove product
  removeFromWishlist(productId: number): void {

    const updatedWishlist = this.wishlistItems.filter(
      product => product.id !== productId
    );

    this.updateWishlist(updatedWishlist);
  }

  // Check if product exists
  isInWishlist(productId: number): boolean {

    return this.wishlistItems.some(
      product => product.id === productId
    );
  }

  // Add or remove product
  toggleWishlist(product: Product): void {

    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  // Move product from wishlist to cart
  moveToCart(productId: number): void {

    const product = this.wishlistItems.find(
      item => item.id === productId
    );

    if (!product) {
      return;
    }

    this.cartService.addToCart(product);

    this.removeFromWishlist(productId);
  }

  // Clear wishlist
  clearWishlist(): void {
    this.updateWishlist([]);
  }

  // Update wishlist and persist it
  private updateWishlist(products: Product[]): void {

    this.wishlistSubject.next(products);

    try {
      this.storage?.setItem(
        this.STORAGE_KEY,
        JSON.stringify(products)
      );
    } catch {
      // Ignore storage failures; the in-memory wishlist still works for this session.
    }
  }

  // Restore wishlist from LocalStorage
  private loadWishlist(): Product[] {

    const storage = this.storage;

    if (!storage) {
      return [];
    }

    try {

      const savedWishlist = storage.getItem(this.STORAGE_KEY);

      return savedWishlist
        ? JSON.parse(savedWishlist) as Product[]
        : [];

    } catch {
      return [];
    }
  }

  private get storage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
}