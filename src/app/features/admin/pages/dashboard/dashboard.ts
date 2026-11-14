
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { AdminProductService } from '../../../../core/services/admin-product';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Dashboard implements OnInit {

  private productService = inject(AdminProductService);

  products: Product[] = [];

  totalProducts = 0;
  totalCategories = 0;
  lowStockProducts = 0;
  averagePrice = 0;

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({

      next: response => {

        this.products = response.products;

        this.totalProducts = response.total;

        this.totalCategories = new Set(
          this.products.map(p => p.category)
        ).size;

        this.lowStockProducts = this.products.filter(
          p => p.stock < 10
        ).length;

        this.averagePrice = this.products.length
          ? this.products.reduce(
              (sum, product) => sum + product.price,
              0
            ) / this.products.length
          : 0;

        this.isLoading = false;
      },

      error: () => {
        this.errorMessage = 'Unable to load dashboard statistics.';
        this.isLoading = false;
      }

    });
  }
}
