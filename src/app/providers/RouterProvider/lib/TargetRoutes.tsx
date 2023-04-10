import { AppRoute } from '@app/providers/RouterProvider/types';
import { BudgetCutsPage, ClientsPage } from '@pages/Target';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { ClientTable } from '@pages/Target/ClientsPage/ui/ClientTable';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { TargetSettingsPage } from '@pages/Target/TargetSettingsPage';
import { ClientSettings } from '@pages/Target/TargetSettingsPage/ui/ClientSettings';
import { CompanyTagsSetting } from '@pages/Target/TargetSettingsPage/ui/CompanyTagsSetting';
import React from 'react';
import { ROUTES } from '@shared/const/routes';

export const TargetRoutes: AppRoute[] = [
  {
    name: 'Клиент',
    element: <ClientsPage />,
    path: ROUTES.TARGET.Clients,
    protected: true,
    header: true,
    children: [
      {
        index: true,
        element: <TableSkeleton rows={5} columns={6} style={{ width: '100%' }} />,
      },
      {
        path: ROUTES.TARGET.Client,
        element: <ClientTable />,
      },
    ],
  },
  {
    name: 'Senler',
    element: <SenlerPage />,
    path: ROUTES.TARGET.Companies,
    protected: true,
    header: true,
  },
  {
    name: 'Открут',
    element: <BudgetCutsPage />,
    path: ROUTES.TARGET.BudgetCuts,
    protected: true,
    header: true,
  },
  {
    name: 'Настройки',
    element: <TargetSettingsPage />,
    path: ROUTES.TARGET.Settings,
    protected: true,
    header: true,
    children: [
      {
        index: true,
        element: <ClientSettings />,
      },
      {
        path: ROUTES.TARGET.SettingsCompanies,
        element: <CompanyTagsSetting />,
      },
      {
        path: ROUTES.TARGET.SettingsClient,
        element: <ClientSettings />,
      },
    ],
  },
];
