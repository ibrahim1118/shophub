import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { User } from '../models/auth.model';
import { AuthService } from '../services/auth';
import { TokenStorageService } from '../services/token-storage';

export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  if (!tokenStorage.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const checkAdmin = (user: User | null) =>
    user?.role === 'admin' ? true : router.createUrlTree(['/']);

  // The login response does not carry the role, so only trust a cached user
  // that already has one. Otherwise ask the API.
  const cached = authService.currentUser;

  if (cached?.role) {
    return checkAdmin(cached);
  }

  return authService.getCurrentUser().pipe(
    map((user) => checkAdmin(user)),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
