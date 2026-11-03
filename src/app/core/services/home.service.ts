import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductsResponse } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com';

  getFeaturedProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/products?sortBy=rating&order=desc&limit=8`
    );
  }

  getNewArrivals(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/products?sortBy=id&order=desc&limit=8`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/products/categories`
    );
  }
}
