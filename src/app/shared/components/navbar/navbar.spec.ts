import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand and navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('ShopHub');
    expect(text).toContain('Home');
    expect(text).toContain('Products');
    expect(text).toContain('Categories');
    expect(text).toContain('Login');
    expect(text).toContain('Register');
  });

  it('should render the search bar, cart count and wishlist icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('input[type="search"]')).toBeTruthy();
    expect(compiled.querySelector('.badge-count')?.textContent?.trim()).toBe('0');
    expect(compiled.querySelector('a[aria-label="Wishlist"]')).toBeTruthy();
  });
});
