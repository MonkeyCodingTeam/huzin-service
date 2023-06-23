import { ROUTES } from '@shared/const/routes';
import React from 'react';
import { AppRoute } from '@app/providers/RouterProvider';
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
