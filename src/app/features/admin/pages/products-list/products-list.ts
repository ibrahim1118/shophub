
import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminProductService } from '../../../../core/services/admin-product';
import { Product } from '../../../../core/models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink ,CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class ProductsList implements OnInit {

  private productService = inject(AdminProductService);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  selectedCategory = '';

  categories: string[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({

      next: response => {

        this.products = response.products;
        this.categories = [
          ...new Set(this.products.map(p => p.category))
        ];

        this.applyFilters();
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage = 'Unable to load products.';
        this.isLoading = false;
      }

    });
  }

  applyFilters(): void {

    const term = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {

      const matchesSearch =
        product.title.toLowerCase().includes(term);

      const matchesCategory =
        !this.selectedCategory ||
        product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  deleteProduct(product: Product): void {

    const confirmed = confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    this.productService.deleteProduct(product.id).subscribe({

      next: () => {

        // DummyJSON doesn't persist the deletion.
        // Update the current UI manually.
        this.products = this.products.filter(
          p => p.id !== product.id
        );

        this.applyFilters();

      },

      error: () => {
        this.errorMessage = 'Unable to delete this product.';
      }

    });
  }

}
