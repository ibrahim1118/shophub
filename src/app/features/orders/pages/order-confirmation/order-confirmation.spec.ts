import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { OrderConfirmation } from './order-confirmation';

describe('OrderConfirmation', () => {
  let component: OrderConfirmation;
  let fixture: ComponentFixture<OrderConfirmation>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [OrderConfirmation],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'ORD-1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
