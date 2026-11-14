import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CategoryProducts } from './category-products';

describe('CategoryProducts', () => {
  let component: CategoryProducts;
  let fixture: ComponentFixture<CategoryProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryProducts],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'beauty' })),
            snapshot: { paramMap: convertToParamMap({ slug: 'beauty' }) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
