import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Product } from '../../../../core/models/product.model';
import { ProductCard } from './product-card';

const PRODUCT: Product = {
  id: 1,
  title: 'Test product',
  description: 'A product used by the product card tests.',
  price: 19.99,
  discountPercentage: 0,
  rating: 5,
  stock: 10,
  brand: 'ShopHub',
  category: 'test',
  thumbnail: 'https://dummyjson.com/icon/test/128',
  images: [],
};

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = PRODUCT;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
