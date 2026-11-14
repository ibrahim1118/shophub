import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NewArrivals } from './new-arrivals';

describe('NewArrivals', () => {
  let component: NewArrivals;
  let fixture: ComponentFixture<NewArrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArrivals],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewArrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
