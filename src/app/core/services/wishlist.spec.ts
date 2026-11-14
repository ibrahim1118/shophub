import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import type { Product } from '../models/product.model';
import { CartService } from './cart';
import { WishlistService } from './wishlist';

const PRODUCT: Product = {
  id: 1,
  title: 'Test product',
  description: 'A product used by the wishlist tests.',
  price: 19.99,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  brand: 'ShopHub',
  category: 'test',
  thumbnail: 'https://dummyjson.com/icon/test/128',
  images: [],
};

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle products in and out of the wishlist', async () => {
    service.toggleWishlist(PRODUCT);

    expect(await firstValueFrom(service.wishlistCount$)).toBe(1);
    expect(await firstValueFrom(service.wishlistItems$)).toEqual([PRODUCT]);
    expect(await firstValueFrom(service.wishlistIds$)).toEqual(new Set([PRODUCT.id]));

    service.toggleWishlist(PRODUCT);

    expect(await firstValueFrom(service.wishlistCount$)).toBe(0);
    expect(await firstValueFrom(service.wishlistItems$)).toEqual([]);
  });

  it('should remove products and clear the wishlist', async () => {
    service.addToWishlist(PRODUCT);
    service.addToWishlist(PRODUCT);
    expect(await firstValueFrom(service.wishlistCount$)).toBe(1);

    service.removeFromWishlist(PRODUCT.id);
    expect(await firstValueFrom(service.wishlistCount$)).toBe(0);

    service.addToWishlist(PRODUCT);
    service.clearWishlist();
    expect(await firstValueFrom(service.wishlistCount$)).toBe(0);
  });

  it('should move a product from the wishlist to the cart', async () => {
    const cartService = TestBed.inject(CartService);
    service.addToWishlist(PRODUCT);

    service.moveToCart(PRODUCT.id);

    expect(await firstValueFrom(service.wishlistCount$)).toBe(0);
    expect(await firstValueFrom(cartService.cartCount$)).toBe(1);
    expect(await firstValueFrom(cartService.cartItems$)).toEqual([
      { product: PRODUCT, quantity: 1 },
    ]);
  });

  it('should restore the wishlist from storage', async () => {
    service.addToWishlist(PRODUCT);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(WishlistService);

    expect(await firstValueFrom(restored.wishlistCount$)).toBe(1);
    expect(await firstValueFrom(restored.wishlistItems$)).toEqual([PRODUCT]);
  });
});
