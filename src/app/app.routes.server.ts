import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'cart',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client,
  },
  {
    path: 'order-confirmation/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'orders',
    renderMode: RenderMode.Client,
  },
  {
    path: 'orders/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'wishlist',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'register',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'categories/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
