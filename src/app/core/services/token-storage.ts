import { Injectable } from '@angular/core';

import type { User } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly ACCESS_TOKEN = 'shophub.accessToken';
  private readonly REFRESH_TOKEN = 'shophub.refreshToken';
  private readonly USER = 'shophub.user';

  saveTokens(accessToken: string, refreshToken: string): void {
    const storage = this.storage;

    storage?.setItem(this.ACCESS_TOKEN, accessToken);
    storage?.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    return this.storage?.getItem(this.ACCESS_TOKEN) ?? null;
  }

  getRefreshToken(): string | null {
    return this.storage?.getItem(this.REFRESH_TOKEN) ?? null;
  }

  saveUser(user: User): void {
    this.storage?.setItem(this.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = this.storage?.getItem(this.USER);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  clearTokens(): void {
    const storage = this.storage;

    storage?.removeItem(this.ACCESS_TOKEN);
    storage?.removeItem(this.REFRESH_TOKEN);
  }

  clearSession(): void {
    this.clearTokens();
    this.storage?.removeItem(this.USER);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  private get storage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
}
