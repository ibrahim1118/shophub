import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token-storage';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should persist and clear a session', () => {
    service.saveTokens('access-token', 'refresh-token');
    service.saveUser({
      id: 1,
      username: 'emilys',
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: '',
      role: 'admin',
    });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getAccessToken()).toBe('access-token');
    expect(service.getRefreshToken()).toBe('refresh-token');
    expect(service.getUser()?.username).toBe('emilys');

    service.clearSession();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.getUser()).toBeNull();
  });
});
