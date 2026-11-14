import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { OrderDetails } from './order-details';

describe('OrderDetails', () => {
  let component: OrderDetails;
  let fixture: ComponentFixture<OrderDetails>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [OrderDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'ORD-1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
