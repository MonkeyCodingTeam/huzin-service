import React from 'react';
import { AppRoute } from '@app/providers/RouterProvider/types';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';
import { AuthRoutes } from '@app/providers/RouterProvider/lib/AuthRoutes';
import { StubPage } from '@pages/StubPage';
import { MainPage } from '@pages/MainPage';
import { ClientReportPage } from '@pages/Target/ClientReportPage';
import { ROUTES } from '@shared/const/routes';

export const ProtectedAppRoutes: AppRoute[] = [
  ...TargetRoutes,
  {
    path: '/',
    protected: true,
    element: <MainPage />,
  },
];

export const AppRoutes: AppRoute[] = [
  ...AuthRoutes,
  {
    path: '*',
    protected: false,
    element: <StubPage />,
  },
  {
    path: ROUTES.TARGET.ClientReport,
    protected: false,
    element: <ClientReportPage />,
  },
];
