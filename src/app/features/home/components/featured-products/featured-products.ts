import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  selector: 'app-featured-products',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  styleUrl: './featured-products.scss',
  templateUrl: './featured-products.html',
})
export class FeaturedProducts {
  private readonly homeService = inject(HomeService);

  protected readonly featuredProducts$ = this.homeService.getFeaturedProducts();
}
