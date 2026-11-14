
import { Component, inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdminProductService } from '../../../../core/services/admin-product';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);

  productId?: number;

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  productForm = this.fb.group({

    title: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    description: ['', Validators.required],

    price: [0, [
      Validators.required,
      Validators.min(0.01)
    ]],

    stock: [0, [
      Validators.required,
      Validators.min(0)
    ]],

    brand: ['', Validators.required],

    category: ['', Validators.required],

    thumbnail: ['', Validators.required]

  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.productId = Number(id);
      this.isEditMode = true;

      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {

    this.isLoading = true;

    this.productService.getProductById(id).subscribe({

      next: product => {

        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
          thumbnail: product.thumbnail
        });

        this.isLoading = false;
      },

      error: () => {
        this.errorMessage = 'Unable to load product.';
        this.isLoading = false;
      }

    });
  }

  saveProduct(): void {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const productData = this.productForm.getRawValue();

    if (this.isEditMode && this.productId) {

      this.productService.updateProduct(
        this.productId,
        productData
      ).subscribe({

        next: () => {
          this.router.navigate(['/admin/products']);
        },

        error: () => {
          this.errorMessage = 'Unable to update product.';
          this.isSaving = false;
        }

      });

    } else {

      this.productService.addProduct(
        productData
      ).subscribe({

        next: () => {
          this.router.navigate(['/admin/products']);
        },

        error: () => {
          this.errorMessage = 'Unable to add product.';
          this.isSaving = false;
        }

      });

    }
  }

}
