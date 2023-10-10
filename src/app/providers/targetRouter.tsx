import { BudgetCutsPage } from '@pages/Target/BudgetCutsPage';
import { ClientSettingsPage } from '@pages/Target/ClientSettingsPage';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { TARGET_ROUTES } from '@shared/const';
import { ClientsPage } from 'pages/Target/ClientsPage';

const {
  BaseClientStats,
  ClientStats,
  SenlerStats,
  BudgetCuts,
  BaseClientSettings,
  ClientSettings,
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
    path: BudgetCuts,
    element: <BudgetCutsPage />,
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
