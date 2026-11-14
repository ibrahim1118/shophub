import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { CategoryService } from '../../../../core/services/category';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class CategoryProducts implements OnInit {

  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  products: Product[] = [];

  categorySlug = '';
  categoryName = '';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.categorySlug = params.get('slug') ?? '';
        this.categoryName = this.formatCategoryName(this.categorySlug);

        this.loading = true;
        this.errorMessage = '';

        return this.categoryService.getProductsByCategory(
          this.categorySlug
        );
      })
    ).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.products = [];
        this.errorMessage = 'Failed to load products for this category.';
        this.loading = false;
      }
    });
  }

  formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}