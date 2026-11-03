import { Component } from '@angular/core';
import { FeaturedProducts } from './components/featured-products/featured-products';
import { NewArrivals } from './components/new-arrivals/new-arrivals';
import { PopularCategories } from './components/popular-categories/popular-categories';

@Component({
  selector: 'app-home',
  imports: [FeaturedProducts, NewArrivals, PopularCategories],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
