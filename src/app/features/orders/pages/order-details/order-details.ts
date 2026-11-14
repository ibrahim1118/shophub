
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../../core/services/order';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss'
})
export class OrderDetails {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order: Order | undefined;

  constructor() {
    const orderId =
      this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.order = this.orderService.getOrderById(orderId);
    }
  }

  getStatusClass(status: Order['status']): string {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';

      case 'Processing':
        return 'bg-info text-dark';

      case 'Delivered':
        return 'bg-success';

      default:
        return 'bg-secondary';
    }
  }
}
