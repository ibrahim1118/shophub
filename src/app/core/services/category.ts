import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/products';

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/categories`
    );
  }

  // Get products by category
  getProductsByCategory(
    slug: string,
    limit: number = 12,
    skip: number = 0
  ): Observable<ProductsResponse> {

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`
    );
  }
}