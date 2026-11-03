import { Component } from '@angular/core';
import { FeaturedProducts } from './components/featured-products/featured-products';
import { PopularCategories } from './components/popular-categories/popular-categories';
import { NewArrivals } from './components/new-arrivals/new-arrivals';

@Component({
  selector: 'app-home',
  imports: [FeaturedProducts, PopularCategories, NewArrivals],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
