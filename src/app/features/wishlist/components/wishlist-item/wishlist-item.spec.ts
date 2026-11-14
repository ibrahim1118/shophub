import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { Product } from '../../../../core/models/product.model';
import { WishlistItem } from './wishlist-item';

const PRODUCT: Product = {
  id: 1,
  title: 'Test product',
  description: 'A product used by the wishlist item tests.',
  price: 19.99,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  brand: 'ShopHub',
  category: 'test',
  thumbnail: 'https://dummyjson.com/icon/test/128',
  images: [],
};

describe('WishlistItem', () => {
  let component: WishlistItem;
  let fixture: ComponentFixture<WishlistItem>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WishlistItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistItem);
    component = fixture.componentInstance;
    component.product = PRODUCT;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
