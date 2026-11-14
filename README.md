# Shophub

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Authentication

ShopHub includes a demo authentication flow backed by the public
[DummyJSON auth API](https://dummyjson.com/docs/auth). Credentials are verified by the API,
and the signed-in user's role is read from the authenticated `/auth/me` endpoint.

### Demo accounts

| Role     | Username   | Password      |
| -------- | ---------- | ------------- |
| Admin    | `emilys`   | `emilyspass`  |
| Customer | `averyp`   | `averyppass`  |

The login page lists both accounts and can fill them in with one click.

### Protected routes

| Route       | Access required                  |
| ----------- | -------------------------------- |
| `/login`    | Public                           |
| `/register` | Public                           |
| `/profile`  | Signed-in user (`authGuard`)     |
| `/admin`    | `admin` role (`adminGuard`)      |

`/admin` redirects customers to the home page and unauthenticated visitors to `/login`
(with a `returnUrl` that is used after signing in).

### How it works

- `AuthService` (`src/app/core/services/auth.ts`) exchanges credentials for access and refresh
  tokens.
- `TokenStorageService` persists the tokens and cached user in `localStorage`, and is a no-op during
  server-side rendering.
- `authInterceptor` attaches the bearer token to outgoing requests and clears the session on a
  `401` response.
- `authGuard` and `adminGuard` protect client routes; the admin role is confirmed against the API,
  not just the cached profile.
- Change detection runs through zone.js. Angular 22 defaults components to `OnPush`, so the
  components that assign plain fields inside HTTP callbacks opt into
  `ChangeDetectionStrategy.Eager`; signal- and `async`-pipe-driven views keep the default.

### Registration

DummyJSON does not persist new users. Accounts created on the registration page are therefore kept
in this browser (with a demo-only password hash) so that you can immediately sign in with them;
those accounts get the `customer` role. This is a demo convenience, not a production credential
store — a production system needs a real backend that enforces authentication and authorization on
every protected endpoint.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
