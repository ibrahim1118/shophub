import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Product } from '../../../../core/models/product.model';
import { CartItemComponent } from './cart-item';

const PRODUCT: Product = {
  id: 1,
  title: 'Test product',
  description: 'A product used by the cart item tests.',
  price: 19.99,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  brand: 'ShopHub',
  category: 'test',
  thumbnail: 'https://dummyjson.com/icon/test/128',
  images: [],
};

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = { product: PRODUCT, quantity: 2 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
