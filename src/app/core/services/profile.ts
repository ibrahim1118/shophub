import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

import type { User, UpdateProfileRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://dummyjson.com';
  private readonly STORAGE_KEY = 'shophub_profile';

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`).pipe(
      map((user) => {
        const storage = this.storage;

        if (!storage) {
          return user;
        }

        try {
          const savedProfile = storage.getItem(`${this.STORAGE_KEY}_${user.id}`);

          if (savedProfile) {
            return {
              ...user,
              ...(JSON.parse(savedProfile) as Partial<User>),
            };
          }
        } catch {
          // Ignore malformed cached profiles.
        }

        return user;
      }),
    );
  }

  updateProfile(user: User, data: UpdateProfileRequest): Observable<User> {
    return this.http
      .put<User>(`${this.API_URL}/users/${user.id}`, data)
      .pipe(
        map((response) => ({
          ...user,
          ...response,
          ...data,
        })),
        tap((updatedUser) => {
          try {
            this.storage?.setItem(
              `${this.STORAGE_KEY}_${user.id}`,
              JSON.stringify(updatedUser),
            );
          } catch {
            // Ignore storage failures; the update still succeeded.
          }
        }),
      );
  }

  private get storage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }
}
