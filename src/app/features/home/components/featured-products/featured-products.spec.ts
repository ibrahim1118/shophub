import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FeaturedProducts } from './featured-products';

describe('FeaturedProducts', () => {
  let component: FeaturedProducts;
  let fixture: ComponentFixture<FeaturedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProducts],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
