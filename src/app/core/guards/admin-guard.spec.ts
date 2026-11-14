import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { of } from 'rxjs';

import { User } from '../models/auth.model';
import { AuthService } from '../services/auth';
import { TokenStorageService } from '../services/token-storage';
import { adminGuard } from './admin-guard';

const ADMIN: User = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: '',
  role: 'admin',
};

const CUSTOMER: User = { ...ADMIN, id: 16, username: 'averyp', role: 'user' };

describe('adminGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/admin' } as RouterStateSnapshot;

  let tokenStorage: TokenStorageService;

  const setup = (currentUser: User | null) => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            currentUser,
            getCurrentUser: () => of(currentUser as User),
            logout: () => undefined,
          },
        },
      ],
    });
    tokenStorage = TestBed.inject(TokenStorageService);
  };

  const runGuard = () => TestBed.runInInjectionContext(() => adminGuard(route, state));

  it('should redirect to login when logged out', () => {
    setup(null);

    const result = runGuard();

    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fadmin');
  });

  it('should allow an admin user', () => {
    setup(ADMIN);
    tokenStorage.saveTokens('access-token', 'refresh-token');

    expect(runGuard()).toBe(true);
  });

  it('should deny a non-admin customer', () => {
    setup(CUSTOMER);
    tokenStorage.saveTokens('access-token', 'refresh-token');

    const result = runGuard();

    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/');
  });
});
