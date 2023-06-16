import { StubPage } from '@pages/StubPage';
import { ROUTES } from '@shared/const/routes';
import { PrimeIcons } from 'primereact/api';
import React from 'react';
import { AppRoute } from '@app/providers/RouterProvider';

export const ContentRoutes: AppRoute[] = [
  {
    name: 'Сторис',
    icon: PrimeIcons.VIDEO,
    element: <StubPage />,
    path: ROUTES.CONTENT.Stories,
  },
];
