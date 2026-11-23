import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'prescriptions' },
  {
    path: 'prescriptions',
    title: 'Prescrições',
    loadComponent: () =>
      import('./presentation/pages/prescription-list/prescription-list.page').then((m) => m.PrescriptionListPage),
  },
  {
    path: 'prescriptions/new',
    title: 'Nova prescrição',
    loadComponent: () =>
      import('./presentation/pages/prescription-form/prescription-form.page').then((m) => m.PrescriptionFormPage),
  },
  {
    path: 'prescriptions/:id',
    title: 'Prescrição',
    loadComponent: () =>
      import('./presentation/pages/prescription-detail/prescription-detail.page').then((m) => m.PrescriptionDetailPage),
  },
  {
    path: 'prescriptions/:id/edit',
    title: 'Editar prescrição',
    loadComponent: () =>
      import('./presentation/pages/prescription-form/prescription-form.page').then((m) => m.PrescriptionFormPage),
  },
  { path: '**', redirectTo: 'prescriptions' },
];
