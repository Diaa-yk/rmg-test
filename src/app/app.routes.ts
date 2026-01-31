import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [authGuard], 
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'product', 
        loadComponent: () => import('./features/product-list/product-list.component').then(m => m.ProductListComponent) 
      },
      { 
        path: 'product/add', 
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
      },
      { 
        path: 'product/:id', 
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

