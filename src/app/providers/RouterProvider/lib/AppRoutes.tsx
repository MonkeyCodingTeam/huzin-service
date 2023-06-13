import React from 'react';
import { StubPage } from '@pages/StubPage';
import { MainPage } from '@pages/MainPage';
import { ClientReportPage } from '@pages/Target/ClientReportPage';
import {AppRoute, AuthRoutes, ContentRoutes, TargetRoutes} from "@app/providers/RouterProvider";

export const ProtectedAppRoutes: AppRoute[] = [
  ...TargetRoutes,
  ...ContentRoutes,
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
    path: '/client_report/:clientId/:token',
    protected: false,
    element: <ClientReportPage />,
  },
];
