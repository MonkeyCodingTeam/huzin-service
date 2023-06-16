import { ROUTES } from '@shared/const/routes';
import React from 'react';
import { AppRoute } from '@app/providers/RouterProvider';
import { ReportPage } from '@pages/Admin/ReportPage';

export const AdminRoutes: AppRoute[] = [
  {
    name: 'Отчёты',
    icon: 'pi-megaphone',
    element: <ReportPage />,
    path: ROUTES.ADMIN.Reports,
  },
];
