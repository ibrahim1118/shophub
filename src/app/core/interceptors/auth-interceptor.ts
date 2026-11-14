import { Injector, inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth';
import { TokenStorageService } from '../services/token-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const injector = inject(Injector);

  const token = tokenStorage.getAccessToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const isLoginRequest = req.url.includes('/auth/login');

      if (error instanceof HttpErrorResponse && error.status === 401 && !isLoginRequest) {
        // Resolved lazily to avoid a circular dependency while HttpClient is
        // being constructed.
        injector.get(AuthService).logout();

        if (router.url !== '/login') {
          void router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    }),
  );
};
