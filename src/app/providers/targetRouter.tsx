import { ClientSettingsPage } from '@pages/Target/ClientSettingsPage';
import { ExpensesPage } from '@pages/Target/Expenses';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { TARGET_ROUTES } from '@shared/const';
import { ClientsPage } from 'pages/Target/ClientsPage';

const { BaseClientStats, ClientStats, SenlerStats, Expenses, BaseClientSettings, ClientSettings } =
  TARGET_ROUTES;

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
    path: BaseClientSettings,
    element: <ClientSettingsPage />,
  },
  {
    path: ClientSettings,
    element: <ClientSettingsPage />,
  },
];
