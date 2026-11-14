import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/pages/product-details/product-details').then(
        (m) => m.ProductDetails,
      ),
  },
  {
  path: 'admin',
  canActivate: [adminGuard],
  canActivateChild: [adminGuard],

  loadComponent: () =>
    import('./features/admin/layout/admin-layout/admin-layout')
      .then(m => m.AdminLayout),

  children: [

    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },

    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/admin/pages/dashboard/dashboard')
          .then(m => m.Dashboard)
    },

    {
      path: 'products',
      loadComponent: () =>
        import('./features/admin/pages/products-list/products-list')
          .then(m => m.ProductsList)
    },

    {
      path: 'products/add',
      loadComponent: () =>
        import('./features/admin/pages/product-form/product-form')
          .then(m => m.ProductForm)
    },

    {
      path: 'products/edit/:id',
      loadComponent: () =>
        import('./features/admin/pages/product-form/product-form')
          .then(m => m.ProductForm)
    }

  ]
},
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/pages/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'order-confirmation/:id',
    loadComponent: () =>
      import('./features/orders/pages/order-confirmation/order-confirmation').then(
        (m) => m.OrderConfirmation,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/pages/order-list/order-list').then((m) => m.OrderList),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/orders/pages/order-details/order-details').then((m) => m.OrderDetails),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/pages/wishlist/wishlist').then((m) => m.Wishlist),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list').then((m) => m.CategoryList),
  },
  {
    path: 'categories/:slug',
    loadComponent: () =>
      import('./features/categories/pages/category-products/category-products').then(
        (m) => m.CategoryProducts,
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
