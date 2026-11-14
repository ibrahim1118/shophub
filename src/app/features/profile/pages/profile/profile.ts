
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProfileService } from '../../../../core/services/profile';
import { OrderService } from '../../../../core/services/order';

import { User } from '../../../../core/models/user.model';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    RouterLink
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);

  user?: User;
  orders: Order[] = [];

  isEditing = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  profileForm = this.fb.group({

    firstName: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    lastName: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    phone: ['', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]],

    image: [''],

    address: this.fb.group({
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    })

  });

  get f() {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getProfile().subscribe({

      next: user => {

        this.user = user;

        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          image: user.image,

          address: {
            address: user.address?.address ?? '',
            city: user.address?.city ?? '',
            state: user.address?.state ?? '',
            postalCode: user.address?.postalCode ?? ''
          }
        });

        // Demo: display saved browser orders.
        this.orders = this.orderService.getOrders();

        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load your profile. Please log in again.';
        this.isLoading = false;
      }

    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.successMessage = '';
  }

  cancelEdit(): void {

    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        image: this.user.image,

        address: {
          address: this.user.address?.address ?? '',
          city: this.user.address?.city ?? '',
          state: this.user.address?.state ?? '',
          postalCode: this.user.address?.postalCode ?? ''
        }
      });
    }

    this.isEditing = false;
  }

  saveProfile(): void {

    if (!this.user || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const data = this.profileForm.getRawValue() as any;

    this.profileService.updateProfile(
      this.user,
      data
    ).subscribe({

      next: updatedUser => {

        this.user = updatedUser;
        this.isEditing = false;
        this.isSaving = false;

        this.successMessage =
          'Your profile has been updated successfully!';
      },

      error: () => {

        this.isSaving = false;

        this.errorMessage =
          'Unable to update your profile. Please try again.';
      }

    });
  }

}
