
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
export class AdminProductService {

  private http = inject(HttpClient);

  private readonly API_URL = 'https://dummyjson.com/products';

  // Get all products
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.API_URL}?limit=0`
    );
  }

  // Get product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.API_URL}/${id}`
    );
  }

  // Add new product
  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(
      `${this.API_URL}/add`,
      product
    );
  }

  // Update existing product
  updateProduct(
    id: number,
    product: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.API_URL}/${id}`,
      product
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(
      `${this.API_URL}/${id}`
    );
  }

  // Get all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.API_URL}/categories`
    );
  }
}
