import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage),
      },
      {
        path: 'registrar',
        loadComponent: () => import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage),
      },
      {
        path: 'info',
        loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
      },
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
    ],
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/detalle/detalle.page').then((m) => m.DetallePage),
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage),
  },
  { path: '', redirectTo: 'tabs/productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/productos' },
];