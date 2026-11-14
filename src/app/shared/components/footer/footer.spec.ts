import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the about, customer service and useful links sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(
      compiled.querySelectorAll('.footer-heading'),
    ).map((heading) => heading.textContent?.trim());

    expect(compiled.querySelector('.about-text')?.textContent).toContain(
      'ShopHub',
    );
    expect(headings).toContain('Customer Service');
    expect(headings).toContain('Useful Links');
  });

  it('should render the social media icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.social-links a');

    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
  });

  it('should render the copyright information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const year = new Date().getFullYear();

    expect(compiled.querySelector('.footer-bottom')?.textContent).toContain(
      `© ${year} ShopHub. All rights reserved.`,
    );
  });
});
