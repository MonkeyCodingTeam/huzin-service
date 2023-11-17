import { CampaignsSettingsPage } from '@pages/Target/CampaignsSettingsPage';
import { InvoicePage } from '@pages/Target/InvoicePage';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { TARGET_ROUTES } from '@shared/const';
import { ClientSettingsPage } from 'pages/Target/ClientSettingsPage';
import { ClientsPage } from 'pages/Target/ClientsPage';
import { ExpensesPage } from 'pages/Target/ExpensesPage';
import { GuestStatsPage } from 'pages/Target/GuestStatsPage';

const {
  BaseClientStats,
  ClientStats,
  SenlerStats,
  Expenses,
  BaseClientSettings,
  ClientSettings,
  GuestStats,
  CampaignsSettings,
  Invoice,
} = TARGET_ROUTES;

export const targetRouter = [
  {
    path: BaseClientStats,
    element: <ClientsPage />,
  },
  {
    path: ClientStats,
    element: <ClientsPage />,
  },
  {
    path: SenlerStats,
    element: <SenlerPage />,
  },
  {
    path: Expenses,
    element: <ExpensesPage />,
  },
  {
    path: Invoice,
    element: <InvoicePage />,
  },
  {
    path: BaseClientSettings,
    element: <ClientSettingsPage />,
  },
  {
    path: ClientSettings,
    element: <ClientSettingsPage />,
  },
  {
    path: CampaignsSettings,
    element: <CampaignsSettingsPage />,
  },
  {
    path: GuestStats,
    element: <GuestStatsPage />,
  },
];
