import { AppRoute } from '@app/providers/RouterProvider/types';
import { BudgetCutsPage, ClientsPage } from '@pages/Target';
import { TableSkeleton } from '@shared/ui/Skeletons';
import { ClientTable } from '@pages/Target/ClientsPage/ui/ClientTable';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { SettingsPage } from 'pages/Target/SettingsPage';
import { ClientSettings } from '@pages/Target/SettingsPage/ui/ClientSettings';
import { CompanyTagsSetting } from '@pages/Target/SettingsPage/ui/CompanyTagsSetting';
import React from 'react';
import { ROUTES } from '@shared/const/routes';
import { PrimeIcons } from 'primereact/api';
import { InvoicePage } from '@pages/Target/InvoicePage';

export const TargetRoutes: AppRoute[] = [
  {
    name: 'Клиенты',
    icon: PrimeIcons.USERS,
    element: <ClientsPage />,
    path: ROUTES.TARGET.Clients,
    protected: true,
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
    icon: PrimeIcons.COMMENTS,
    element: <SenlerPage />,
    path: ROUTES.TARGET.Companies,
    protected: true,
  },
  {
    name: 'Открут',
    icon: PrimeIcons.DOLLAR,
    element: <BudgetCutsPage />,
    path: ROUTES.TARGET.BudgetCuts,
    protected: true,
  },
  {
    name: 'Счета',
    icon: PrimeIcons.CREDIT_CARD,
    element: <InvoicePage />,
    path: ROUTES.TARGET.Invoice,
    protected: true,
  },
  {
    name: 'Настройки',
    icon: PrimeIcons.COG,
    element: <SettingsPage />,
    path: ROUTES.TARGET.Settings,
    protected: true,
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
