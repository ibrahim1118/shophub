import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  imports: [RouterLink , AsyncPipe  , CurrencyPipe],
  selector: 'app-new-arrivals',
  styleUrl: './new-arrivals.scss',
  templateUrl: './new-arrivals.html',
})
export class NewArrivals {
  private readonly homeService = inject(HomeService);

 
  protected readonly newArrivals$ = this.homeService.getNewArrivals();
}
