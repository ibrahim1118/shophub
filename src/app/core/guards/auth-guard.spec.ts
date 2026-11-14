import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { TokenStorageService } from '../services/token-storage';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/profile' } as RouterStateSnapshot;

  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  const runGuard = () => TestBed.runInInjectionContext(() => authGuard(route, state));

  it('should allow access when a session exists', () => {
    tokenStorage.saveTokens('access-token', 'refresh-token');

    expect(runGuard()).toBe(true);
  });

  it('should redirect to login with a return URL when logged out', () => {
    const result = runGuard();

    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Fprofile',
    );
  });
});
