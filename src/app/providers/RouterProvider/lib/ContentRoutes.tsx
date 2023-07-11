import { type AppRoute, ROUTES } from '@app/providers/RouterProvider';
import { SettingsPage } from '@pages/Content/SettingsPage';
import { StoriesPage } from '@pages/Content/StoriesPage';
import { PrimeIcons } from 'primereact/api';
import type React from 'react';

export const ContentRoutes: AppRoute[] = [
  {
    name: 'Сторис',
    icon: PrimeIcons.VIDEO,
    element: <StoriesPage />,
    path: ROUTES.CONTENT.Stories,
    children: [
      {
        path: ROUTES.CONTENT.StoriesGroup,
        element: <StoriesPage />,
      },
    ],
  },
  {
    name: 'Настройки',
    icon: PrimeIcons.COG,
    element: <SettingsPage />,
    path: ROUTES.CONTENT.Settings,
  },
];
