import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  User,
} from '../models/auth.model';

import { TokenStorageService } from './token-storage';

const ACCOUNTS_KEY = 'shophub.accounts';
const LOCAL_TOKEN_PREFIX = 'local-';

interface StoredAccount {
  user: User;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);

  private apiUrl = 'https://dummyjson.com/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.tokenStorage.isLoggedIn();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const username = credentials.username.trim();

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        ...credentials,
        username,
        expiresInMins: credentials.expiresInMins ?? 60,
      })
      .pipe(
        tap((response) => this.startSession(response)),
        // The login response does not include the role, so fetch the profile
        // once to hydrate it. A failure here must not fail the login itself.
        switchMap((response) =>
          this.getCurrentUser().pipe(
            map(() => response),
            catchError(() => of(response)),
          ),
        ),
        // DummyJSON only knows its demo users. Accounts created through the
        // registration page are kept locally and checked as a fallback.
        catchError((error: unknown) => {
          const local = this.loginWithLocalAccount(username, credentials.password);
          return local ? of(local) : throwError(() => error);
        }),
      );
  }

  register(request: RegisterRequest): Observable<User> {
    const email = request.email.trim().toLowerCase();
    const accounts = this.readAccounts();

    if (accounts.some((account) => account.user.email.toLowerCase() === email)) {
      return throwError(() => new Error('An account with this email already exists.'));
    }

    const username = this.uniqueUsername(email, accounts);
    const user: User = {
      id: accounts.reduce((highest, account) => Math.max(highest, account.user.id), 0) + 1,
      username,
      email,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      gender: '',
      image: `https://dummyjson.com/icon/${encodeURIComponent(username)}/128`,
      role: 'customer',
    };

    accounts.push({
      user,
      passwordHash: this.hashPassword(request.password, email),
    });
    this.writeAccounts(accounts);

    return of(user);
  }

  getCurrentUser(): Observable<User> {
    if (this.isLocalSession()) {
      const user = this.tokenStorage.getUser();

      if (!user) {
        return throwError(() => new Error('No local session found.'));
      }

      this.currentUserSubject.next(user);
      return of(user);
    }

    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        const user = this.toUser(response);

        this.tokenStorage.saveUser(user);
        this.currentUserSubject.next(user);
      }),
    );
  }

  /** Restores the session after a full page reload. Browser only. */
  loadCurrentUser(): void {
    const cached = this.tokenStorage.getUser();

    if (cached) {
      this.currentUserSubject.next(cached);
    }

    if (!this.tokenStorage.getAccessToken()) {
      return;
    }

    if (this.isLocalSession()) {
      if (!cached) {
        this.logout();
      }
      return;
    }

    this.getCurrentUser().subscribe({
      error: () => this.logout(),
    });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken || this.isLocalSession()) {
      return throwError(() => new Error('No refresh token available.'));
    }

    const body: RefreshTokenRequest = { refreshToken };

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, body).pipe(
      tap((response) => this.startSession(response)),
    );
  }

  logout(): void {
    this.tokenStorage.clearSession();
    this.currentUserSubject.next(null);
  }

  private startSession(response: AuthResponse): void {
    this.tokenStorage.saveTokens(response.accessToken, response.refreshToken);

    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
      role: response.role,
    };

    this.tokenStorage.saveUser(user);
    this.currentUserSubject.next(user);
  }

  private toUser(source: User): User {
    return {
      id: source.id,
      username: source.username,
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      gender: source.gender,
      image: source.image,
      role: source.role,
    };
  }

  private loginWithLocalAccount(identifier: string, password: string): AuthResponse | null {
    const key = identifier.trim().toLowerCase();
    const account = this.readAccounts().find(
      (candidate) =>
        candidate.user.email.toLowerCase() === key ||
        candidate.user.username.toLowerCase() === key,
    );

    if (!account || account.passwordHash !== this.hashPassword(password, account.user.email)) {
      return null;
    }

    const response: AuthResponse = {
      ...account.user,
      accessToken: `${LOCAL_TOKEN_PREFIX}${this.randomToken()}`,
      refreshToken: `${LOCAL_TOKEN_PREFIX}refresh-${this.randomToken()}`,
    };

    this.startSession(response);
    return response;
  }

  private isLocalSession(): boolean {
    return this.tokenStorage.getAccessToken()?.startsWith(LOCAL_TOKEN_PREFIX) ?? false;
  }

  private uniqueUsername(email: string, accounts: StoredAccount[]): string {
    const base =
      (email.split('@')[0] ?? 'customer').toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'customer';

    let username = base;
    let suffix = 1;

    while (accounts.some((account) => account.user.username.toLowerCase() === username)) {
      username = `${base}${suffix}`;
      suffix += 1;
    }

    return username;
  }

  /**
   * Non-cryptographic hash that only keeps demo passwords out of plain text.
   * Local accounts are a demo convenience and are not a secure credential store.
   */
  private hashPassword(password: string, salt: string): string {
    const source = `${salt}:${password}`;
    let hash = 0x811c9dc5;

    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }

    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  private randomToken(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }

  private get storage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }

  private readAccounts(): StoredAccount[] {
    const storage = this.storage;

    if (!storage) {
      return [];
    }

    try {
      const raw = storage.getItem(ACCOUNTS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
    } catch {
      return [];
    }
  }

  private writeAccounts(accounts: StoredAccount[]): void {
    try {
      this.storage?.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // Ignore storage failures; registration still succeeds for this session.
    }
  }
}
