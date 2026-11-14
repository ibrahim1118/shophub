import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TokenStorageService } from '../services/token-storage';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach the bearer token when a session exists', () => {
    tokenStorage.saveTokens('access-token', 'refresh-token');

    http.get('/api/test').subscribe();

    const request = httpMock.expectOne('/api/test');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({});
  });

  it('should leave requests untouched when logged out', () => {
    http.get('/api/test').subscribe();

    const request = httpMock.expectOne('/api/test');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('should clear the stored session on a 401 response', () => {
    tokenStorage.saveTokens('access-token', 'refresh-token');

    http.get('/api/protected').subscribe({ error: () => undefined });

    const request = httpMock.expectOne('/api/protected');
    request.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(tokenStorage.isLoggedIn()).toBe(false);
  });
});
