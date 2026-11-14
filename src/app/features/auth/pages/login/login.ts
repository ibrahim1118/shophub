import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './login.scss',
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected readonly successMessage = this.route.snapshot.queryParamMap.get('registered')
    ? 'Your account has been created. Sign in with your email and password.'
    : '';

  protected loading = false;
  protected errorMessage = '';

  protected useDemoAccount(username: string, password: string): void {
    this.loginForm.setValue({ username, password });
    this.errorMessage = '';
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const target = returnUrl?.startsWith('/') ? returnUrl : '/';
        void this.router.navigateByUrl(target);
      },
      error: (error: unknown) => {
        this.loading = false;
        this.errorMessage = this.resolveErrorMessage(error);
      },
    });
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400 || error.status === 401) {
        return 'Invalid username or password. Please try again.';
      }

      if (error.status === 0) {
        return 'Unable to reach the authentication service. Check your connection and try again.';
      }

      const body = error.error as { message?: string } | null;
      return body?.message ?? 'Unable to log in. Please try again.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unable to log in. Please try again.';
  }
}
