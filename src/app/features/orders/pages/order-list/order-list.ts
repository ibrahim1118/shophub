
import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList {

  private orderService = inject(OrderService);

  orders: Order[] = this.orderService.getOrders();

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
