import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrderList } from './order-list';

describe('OrderList', () => {
  let component: OrderList;
  let fixture: ComponentFixture<OrderList>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
