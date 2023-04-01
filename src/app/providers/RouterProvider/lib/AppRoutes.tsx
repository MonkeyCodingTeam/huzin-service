import React, { ReactNode } from 'react';
import { ROUTES } from '@shared/const/routes';
import { BudgetCutsPage, ClientsPage } from '@pages/Target';
import { ClientTable } from '@pages/Target/ClientsPage/ui/ClientTable';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { TargetSettingsPage } from '@pages/Target/TargetSettingsPage/ui/TargetSettingsPage';
import { CompanyTagsSetting } from '@pages/Target/TargetSettingsPage/ui/CompanyTagsSetting';
import { ClientSettings } from '@pages/Target/TargetSettingsPage/ui/ClientSettings';
import { SenlerPage } from '@pages/Target/SenlerPage';

interface AppRoute {
  element: ReactNode;
  path?: ROUTES;
  protected: boolean;
  children?: Omit<AppRoute, 'protected'>[];
  index?: boolean;
}

export const appRoutes: AppRoute[] = [
  {
    element: <ClientsPage />,
    path: ROUTES.TargetClients,
    protected: true,
    children: [
      {
        index: true,
        element: <TableSkeleton rows={5} columns={6} style={{ width: '100%' }} />,
      },
      {
        path: ROUTES.TargetClient,
        element: <ClientTable />,
      },
    ],
  },
  {
    element: <BudgetCutsPage />,
    path: ROUTES.BudgetCuts,
    protected: true,
  },
  {
    element: <SenlerPage />,
    path: ROUTES.TargetCompanies,
    protected: true,
  },
  {
    element: <TargetSettingsPage />,
    path: ROUTES.TargetSettings,
    protected: true,
    children: [
      {
        index: true,
        element: <ClientSettings />,
      },
      {
        path: ROUTES.TargetSettingsCompanies,
        element: <CompanyTagsSetting />,
      },
      {
        path: ROUTES.TargetSettingsClient,
        element: <ClientSettings />,
      },
    ],
  },
];
