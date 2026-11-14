import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import type { CustomerAddress } from '../../../../core/models/order.model';
import { CartService } from '../../../../core/services/cart';
import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  readonly cartItems$ = this.cartService.cartItems$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly shippingCost$ = this.subtotal$.pipe(
    map((subtotal) => this.orderService.calculateShipping(subtotal)),
  );
  readonly total$ = combineLatest([this.subtotal$, this.shippingCost$]).pipe(
    map(([subtotal, shippingCost]) => subtotal + shippingCost),
  );

  readonly checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', Validators.required],
    street: ['', Validators.required],
    building: ['', Validators.required],
    notes: [''],
  });

  get f() {
    return this.checkoutForm.controls;
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const items = this.cartService.cartItems;

    if (!items.length) {
      void this.router.navigate(['/products']);
      return;
    }

    const subtotal = items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    const address = this.checkoutForm.getRawValue() as CustomerAddress;
    const order = this.orderService.createOrder(items, address, subtotal);

    this.cartService.clearCart();
    void this.router.navigate(['/order-confirmation', order.id]);
  }
}
