import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  selector: 'app-popular-categories',
  imports: [AsyncPipe, RouterLink],
  styleUrl: './popular-categories.scss',
  templateUrl: './popular-categories.html',
})
export class PopularCategories {
  private readonly homeService = inject(HomeService);

  
  protected readonly categories$ = this.homeService.getCategories();
}
