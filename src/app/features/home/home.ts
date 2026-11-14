import { Component } from '@angular/core';
import { FeaturedProducts } from './components/featured-products/featured-products';
import { PopularCategories } from './components/popular-categories/popular-categories';
import { NewArrivals } from './components/new-arrivals/new-arrivals';
import { Hero } from './components/hero/hero';

@Component({
  selector: 'app-home',
  imports: [FeaturedProducts, PopularCategories, NewArrivals, Hero],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
