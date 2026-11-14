import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../../core/services/product';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ProductList implements OnInit {

  private productService = inject(ProductService);

  products: Product[] = [];

  categories: any[] = [];

  searchText = '';
  selectedCategory = '';
  sortOrder = '';

  currentPage = 1;
  pageSize = 12;
  totalProducts = 0;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {

    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getProducts(this.pageSize, (this.currentPage - 1) * this.pageSize)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.totalProducts = response.total;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load products.';
          this.loading = false;
        }
      });
  }

  loadCategories(): void {

    this.productService['http']
      .get<any[]>('https://dummyjson.com/products/categories')
      .subscribe({
        next: (response) => {
          this.categories = response;
        }
      });
  }

  search(): void {

    if (!this.searchText.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;

    this.productService
      .searchProducts(this.searchText)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.totalProducts = response.total;
          this.currentPage = 1;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Search failed.';
          this.loading = false;
        }
      });
  }

  filterByCategory(): void {

    this.currentPage = 1;
    this.loading = true;

    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    this.productService
      .getProductsByCategory(this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.totalProducts = response.total;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to filter products.';
          this.loading = false;
        }
      });
  }

  sort(): void {

    if (!this.sortOrder) {
      this.loadProducts();
      return;
    }

    const [sortBy, order] = this.sortOrder.split('-');

    this.loading = true;

    this.productService
      .sortProducts(
        sortBy,
        order as 'asc' | 'desc',
        this.pageSize,
        (this.currentPage - 1) * this.pageSize
      )
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.totalProducts = response.total;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to sort products.';
          this.loading = false;
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  changePage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;

    if (this.selectedCategory) {
      this.filterByCategory();
    } else if (this.searchText.trim()) {
      this.search();
    } else if (this.sortOrder) {
      this.sort();
    } else {
      this.loadProducts();
    }
  }
}