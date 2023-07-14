import { type AppRoute, ROUTES } from '@app/providers/RouterProvider';
import { SettingsPage } from '@pages/Content/SettingsPage';
import { StoriesPage } from '@pages/Content/StoriesPage';
import { PrimeIcons } from 'primereact/api';
import type React from 'react';
import { TagSettings } from '@pages/Content/SettingsPage/ui/TagSettings/ui/TagSettings';
import { GroupSettings } from '@pages/Content/SettingsPage/ui/GroupSettings';

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
    children: [
      {
        index: true,
        element: <GroupSettings />,
      },
      {
        path: ROUTES.CONTENT.GroupSettings,
        element: <GroupSettings />,
      },
      {
        path: ROUTES.CONTENT.TagsSettings,
        element: <TagSettings />,
      },
    ],
  },
];
