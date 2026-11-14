import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import type { Product } from '../models/product.model';
import { CartService } from './cart';

const PRODUCT: Product = {
  id: 1,
  title: 'Test product',
  description: 'A product used by the cart tests.',
  price: 19.99,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  brand: 'ShopHub',
  category: 'test',
  thumbnail: 'https://dummyjson.com/icon/test/128',
  images: [],
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add products and aggregate duplicate entries', async () => {
    service.addToCart(PRODUCT);
    service.addToCart(PRODUCT);

    const items = await firstValueFrom(service.cartItems$);

    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
    expect(await firstValueFrom(service.cartCount$)).toBe(2);
    expect(await firstValueFrom(service.subtotal$)).toBeCloseTo(39.98);
  });

  it('should update quantities, remove items and clear the cart', async () => {
    service.addToCart(PRODUCT);
    service.addToCart(PRODUCT);
    service.increaseQuantity(PRODUCT.id);
    expect(await firstValueFrom(service.cartCount$)).toBe(3);

    service.decreaseQuantity(PRODUCT.id);
    expect(await firstValueFrom(service.cartCount$)).toBe(2);

    service.decreaseQuantity(PRODUCT.id);
    expect(await firstValueFrom(service.cartCount$)).toBe(1);

    service.decreaseQuantity(PRODUCT.id);
    expect(await firstValueFrom(service.cartCount$)).toBe(1);

    service.removeFromCart(PRODUCT.id);
    expect(await firstValueFrom(service.cartItems$)).toEqual([]);

    service.addToCart(PRODUCT);
    service.clearCart();
    expect(await firstValueFrom(service.cartItems$)).toEqual([]);
  });

  it('should restore the cart from storage', async () => {
    service.addToCart(PRODUCT);
    service.addToCart(PRODUCT);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(CartService);

    expect(await firstValueFrom(restored.cartCount$)).toBe(2);
  });
});
