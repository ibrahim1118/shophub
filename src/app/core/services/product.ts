import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Product,
  ProductsResponse
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/products';

  // Get all products with pagination
  getProducts(
    limit: number = 12,
    skip: number = 0
  ): Observable<ProductsResponse> {

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}?limit=${limit}&skip=${skip}`
    );
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // Search products
  searchProducts(query: string): Observable<ProductsResponse> {

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/search?q=${encodeURIComponent(query)}`
    );
  }

  // Get products by category
  getProductsByCategory(
    category: string,
    limit: number = 12,
    skip: number = 0
  ): Observable<ProductsResponse> {

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
    );
  }

  // Sort products
  sortProducts(
    sortBy: string,
    order: 'asc' | 'desc',
    limit: number = 12,
    skip: number = 0
  ): Observable<ProductsResponse> {

    return this.http.get<ProductsResponse>(
      `${this.apiUrl}?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${skip}`
    );
  }
}