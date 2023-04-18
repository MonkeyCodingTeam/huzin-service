import React from 'react';
import { AppRoute } from '@app/providers/RouterProvider/types';
import { TargetRoutes } from '@app/providers/RouterProvider/lib/TargetRoutes';
import { AuthRoutes } from '@app/providers/RouterProvider/lib/AuthRoutes';
import { StubPage } from '@pages/StubPage';
import { MainPage } from '@pages/MainPage';

export const ProtectedAppRoutes: AppRoute[] = [
  ...TargetRoutes,
  {
    path: '/',
    header: true,
    protected: true,
    element: <MainPage />,
  },
];

export const AppRoutes: AppRoute[] = [
  ...AuthRoutes,
  {
    path: '*',
    header: true,
    protected: false,
    element: <StubPage />,
  },
];
