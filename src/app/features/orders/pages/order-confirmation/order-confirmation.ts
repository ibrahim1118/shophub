
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../../core/services/order';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss'
})
export class OrderConfirmation {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = this.orderService.getOrderById(
    this.route.snapshot.paramMap.get('id') ?? ''
  );
}
