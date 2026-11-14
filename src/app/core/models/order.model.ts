import { CartItem } from './cart-item.model';

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  building: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: CustomerAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered';
  paymentMethod: 'Cash on Delivery';
  createdAt: string;
}