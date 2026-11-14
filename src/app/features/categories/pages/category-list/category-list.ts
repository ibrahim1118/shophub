import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CategoryService } from '../../../../core/services/category';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class CategoryList implements OnInit {

  private categoryService = inject(CategoryService);

  categories: Category[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }
}