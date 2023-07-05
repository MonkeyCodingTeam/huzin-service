import { type AppRoute, ROUTES } from '@app/providers/RouterProvider';
import type React from 'react';
import { ReportPage } from '@pages/Admin/ReportPage';
import { PrimeIcons } from 'primereact/api';

export const AdminRoutes: AppRoute[] = [
  {
    name: 'Отчёты',
    icon: PrimeIcons.CHART_BAR,
    element: <ReportPage />,
    path: ROUTES.ADMIN.Reports,
  },
];
