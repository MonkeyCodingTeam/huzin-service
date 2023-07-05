import { TableSkeleton } from '@shared/ui/Skeletons';
import type React from 'react';
import { type AppRoute, ROUTES } from '@app/providers/RouterProvider';
import { PrimeIcons } from 'primereact/api';
import { ClientsPage, ClientTable } from '@pages/Target/ClientsPage';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { BudgetCutsPage } from '@pages/Target/BudgetCutsPage';
import { InvoicePage } from '@pages/Target/InvoicePage';
import { ClientSettings, CompanyTagsSetting, SettingsPage } from '@pages/Target/SettingsPage';

export const TargetRoutes: AppRoute[] = [
  {
    name: 'Клиенты',
    icon: PrimeIcons.USERS,
    element: <ClientsPage />,
    path: ROUTES.TARGET.Clients,
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
  },
  {
    name: 'Открут',
    icon: PrimeIcons.DOLLAR,
    element: <BudgetCutsPage />,
    path: ROUTES.TARGET.BudgetCuts,
  },
  {
    name: 'Счета',
    icon: PrimeIcons.CREDIT_CARD,
    element: <InvoicePage />,
    path: ROUTES.TARGET.Invoice,
  },
  {
    name: 'Настройки',
    icon: PrimeIcons.COG,
    element: <SettingsPage />,
    path: ROUTES.TARGET.Settings,
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
