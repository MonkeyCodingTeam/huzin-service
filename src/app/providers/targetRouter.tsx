import { BudgetCutsPage } from '@pages/Target/BudgetCutsPage';
import { SenlerPage } from '@pages/Target/SenlerPage';
import { TARGET_ROUTES } from '@shared/const';
import { ClientsPage } from 'pages/Target/ClientsPage';

const { BaseClientStats, ClientStats, SenlerStats, BudgetCuts } = TARGET_ROUTES;

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
];
