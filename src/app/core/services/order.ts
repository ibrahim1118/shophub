
import { Injectable } from '@angular/core';
import { Order, CustomerAddress } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly STORAGE_KEY = 'shophub_orders';

 
getOrders(): Order[] {
  const storage = this.storage;

  if (!storage) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storage.getItem(this.STORAGE_KEY) || '[]');

    if (!Array.isArray(parsed)) {
      return [];
    }

    return (parsed as Order[]).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  } catch {
    return [];
  }
}


  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(order => order.id === id);
  }

  calculateShipping(subtotal: number): number {
    return subtotal >= 50 ? 0 : 10;
  }

  createOrder(
    items: CartItem[],
    address: CustomerAddress,
    subtotal: number
  ): Order {

    const shippingCost = this.calculateShipping(subtotal);

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: structuredClone(items),
      address: { ...address },
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toISOString()
    };

    const orders = this.getOrders();
    orders.push(order);

    try {
      this.storage?.setItem(
        this.STORAGE_KEY,
        JSON.stringify(orders)
      );
    } catch {
      // Ignore storage failures; the order is still returned for this session.
    }

    return order;
  }

  private get storage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
}
