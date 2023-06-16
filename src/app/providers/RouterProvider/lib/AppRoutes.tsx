import React from 'react';
import { StubPage } from '@pages/StubPage';
import { MainPage } from '@pages/MainPage';
import { ClientReportPage } from '@pages/Target/ClientReportPage';
import { AppRoute, AuthRoutes } from '@app/providers/RouterProvider';

export const ProtectedAppRoutes: AppRoute[] = [
  {
    path: '/',
    element: <MainPage />,
  },
];

export const AppRoutes: AppRoute[] = [
  ...AuthRoutes,
  {
    path: '*',
    element: <StubPage />,
  },
  {
    path: '/client_report/:clientId/:token',
    element: <ClientReportPage />,
  },
];
