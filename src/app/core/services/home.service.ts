import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with up to 30 hours of battery life.',
    price: 99.99,
    image: 'https://picsum.photos/seed/shophub-headphones/500/500',
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate and sleep in real time.',
    price: 149.99,
    image: 'https://picsum.photos/seed/shophub-watch/500/500',
    category: 'Electronics',
    rating: 4.6,
    inStock: true,
  },
  {
    id: 3,
    name: 'Urban Running Sneakers',
    description: 'Lightweight and breathable shoes built for everyday runs.',
    price: 79.99,
    image: 'https://picsum.photos/seed/shophub-sneakers/500/500',
    category: 'Fashion',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 4,
    name: 'Everyday Canvas Backpack',
    description: 'A durable 20L backpack with a padded laptop sleeve.',
    price: 59.99,
    image: 'https://picsum.photos/seed/shophub-backpack/500/500',
    category: 'Fashion',
    rating: 4.4,
    inStock: false,
  },
];

const NEW_ARRIVALS: Product[] = [
  {
    id: 5,
    name: 'Slim Fit Denim Jacket',
    description: 'A timeless layering piece made from stretch denim.',
    price: 89.99,
    image: 'https://picsum.photos/seed/shophub-jacket/500/500',
    category: 'Fashion',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 6,
    name: 'Portable Bluetooth Speaker',
    description: 'Punchy 360° sound in a compact, waterproof design.',
    price: 49.99,
    image: 'https://picsum.photos/seed/shophub-speaker/500/500',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 7,
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of four hand-glazed mugs for your daily brew.',
    price: 24.99,
    image: 'https://picsum.photos/seed/shophub-mugs/500/500',
    category: 'Home & Living',
    rating: 4.6,
    inStock: true,
  },
  {
    id: 8,
    name: 'Yoga Mat with Carry Strap',
    description: 'Extra-grip 6mm mat that cushions every pose.',
    price: 34.99,
    image: 'https://picsum.photos/seed/shophub-yoga/500/500',
    category: 'Sports & Outdoors',
    rating: 4.3,
    inStock: true,
  },
];

const POPULAR_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://picsum.photos/seed/shophub-electronics/400/300',
    productCount: 120,
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://picsum.photos/seed/shophub-fashion/400/300',
    productCount: 85,
  },
  {
    id: 3,
    name: 'Home & Living',
    image: 'https://picsum.photos/seed/shophub-home/400/300',
    productCount: 64,
  },
  {
    id: 4,
    name: 'Sports & Outdoors',
    image: 'https://picsum.photos/seed/shophub-sports/400/300',
    productCount: 48,
  },
  {
    id: 5,
    name: 'Beauty',
    image: 'https://picsum.photos/seed/shophub-beauty/400/300',
    productCount: 37,
  },
  {
    id: 6,
    name: 'Toys & Games',
    image: 'https://picsum.photos/seed/shophub-toys/400/300',
    productCount: 29,
  },
];

@Service()
export class HomeService {
  getFeaturedProducts(): Observable<Product[]> {
    return of(FEATURED_PRODUCTS);
  }

  getNewArrivals(): Observable<Product[]> {
    return of(NEW_ARRIVALS);
  }

  getCategories(): Observable<Category[]> {
    return of(POPULAR_CATEGORIES);
  }
}
