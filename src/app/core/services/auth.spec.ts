import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthResponse } from '../models/auth.model';
import { AuthService } from './auth';

const DEMO_USER = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out with no current user', () => {
    expect(service.currentUser).toBeNull();
    expect(service.isAuthenticated).toBe(false);
  });

  it('should store the session and load the role on a successful demo login', () => {
    let response: AuthResponse | undefined;

    service.login({ username: 'emilys', password: 'emilyspass' }).subscribe((result) => {
      response = result;
    });

    const loginRequest = httpMock.expectOne('https://dummyjson.com/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body.username).toBe('emilys');
    loginRequest.flush({
      ...DEMO_USER,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const meRequest = httpMock.expectOne('https://dummyjson.com/auth/me');
    meRequest.flush({ ...DEMO_USER, role: 'admin' });

    expect(response?.accessToken).toBe('access-token');
    expect(service.isAuthenticated).toBe(true);
    expect(service.currentUser?.username).toBe('emilys');
    expect(service.currentUser?.role).toBe('admin');
    expect(localStorage.getItem('shophub.accessToken')).toBe('access-token');
  });

  it('should not persist extra profile fields returned by the API', () => {
    service.login({ username: 'emilys', password: 'emilyspass' }).subscribe();
    httpMock
      .expectOne('https://dummyjson.com/auth/login')
      .flush({ ...DEMO_USER, accessToken: 'access-token', refreshToken: 'refresh-token' });
    httpMock
      .expectOne('https://dummyjson.com/auth/me')
      .flush({ ...DEMO_USER, role: 'admin', password: 'secret' });

    const stored = JSON.parse(localStorage.getItem('shophub.user') ?? '{}') as Record<
      string,
      unknown
    >;

    expect(stored['username']).toBe('emilys');
    expect(stored['role']).toBe('admin');
    expect(stored['password']).toBeUndefined();
  });

  it('should surface invalid credentials without creating a session', () => {
    let error: unknown;

    service.login({ username: 'emilys', password: 'wrong' }).subscribe({
      error: (cause: unknown) => {
        error = cause;
      },
    });

    httpMock
      .expectOne('https://dummyjson.com/auth/login')
      .flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

    expect(error).toBeTruthy();
    expect(service.isAuthenticated).toBe(false);
    expect(service.currentUser).toBeNull();
  });

  it('should register a local account and allow signing in with it', () => {
    let username = '';

    service
      .register({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'Jane@Example.com',
        password: 'secret1',
      })
      .subscribe((user) => {
        username = user.username;
      });

    expect(username).toBe('jane');

    let localLogin: AuthResponse | undefined;
    service.login({ username: 'jane@example.com', password: 'secret1' }).subscribe((result) => {
      localLogin = result;
    });

    // The demo API does not know this account, so the service falls back to the
    // locally stored one.
    httpMock
      .expectOne('https://dummyjson.com/auth/login')
      .flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

    expect(localLogin).toBeTruthy();
    expect(service.isAuthenticated).toBe(true);
    expect(service.currentUser?.email).toBe('jane@example.com');
    expect(service.currentUser?.role).toBe('customer');
  });

  it('should reject a duplicate local registration', () => {
    const request = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'secret1',
    };

    service.register(request).subscribe();
    let error: unknown;

    service.register(request).subscribe({
      error: (cause: unknown) => {
        error = cause;
      },
    });

    expect(error instanceof Error).toBe(true);
  });

  it('should clear the session on logout', () => {
    service.login({ username: 'emilys', password: 'emilyspass' }).subscribe();
    httpMock
      .expectOne('https://dummyjson.com/auth/login')
      .flush({ ...DEMO_USER, accessToken: 'access-token', refreshToken: 'refresh-token' });
    httpMock.expectOne('https://dummyjson.com/auth/me').flush({ ...DEMO_USER, role: 'admin' });

    expect(service.isAuthenticated).toBe(true);

    service.logout();

    expect(service.isAuthenticated).toBe(false);
    expect(service.currentUser).toBeNull();
    expect(localStorage.getItem('shophub.accessToken')).toBeNull();
    expect(localStorage.getItem('shophub.user')).toBeNull();
  });
});
