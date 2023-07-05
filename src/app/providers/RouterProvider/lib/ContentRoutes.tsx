import { type AppRoute, ROUTES } from '@app/providers/RouterProvider';
import { PrimeIcons } from 'primereact/api';
import type React from 'react';
import { StoriesPage } from '@pages/Content/StoriesPage';

export const ContentRoutes: AppRoute[] = [
  {
    name: 'Сторис',
    icon: PrimeIcons.VIDEO,
    element: <StoriesPage />,
    path: ROUTES.CONTENT.Stories,
  },
];
