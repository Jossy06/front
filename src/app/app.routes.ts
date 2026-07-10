import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/pages/main-layout/main-layout')
        .then((m) => m.MainLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard')
            .then((m) => m.Dashboard),
      },
      {
        path: 'calculator',
        loadComponent: () =>
          import('./features/calculator/pages/calculator-page/calculator-page')
            .then((m) => m.CalculatorPage),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/pages/client-list/client-list')
            .then((m) => m.ClientList),
      },
      {
        path: 'service-categories',
        loadComponent: () =>
          import('./features/service-categories/pages/service-category-list/service-category-list')
            .then((m) => m.ServiceCategoryList),
      },
      {
        path: 'service-groups',
        loadComponent: () =>
          import('./features/service-groups/pages/service-group-list/service-group-list')
            .then((m) => m.ServiceGroupList),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/pages/service-list/service-list')
            .then((m) => m.ServiceList),
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./features/materials/pages/material-list/material-list')
            .then((m) => m.MaterialList),
      },
      {
        path: 'service-materials',
        loadComponent: () =>
        import('./features/service-materials/pages/service-material-list/service-material-list')
          .then((m) => m.ServiceMaterialList),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];