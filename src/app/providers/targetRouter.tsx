import { TARGET_ROUTES } from '@shared/const';
import { ClientsPage } from 'pages/Target/ClientsPage';

const { BaseClientStats, ClientStats } = TARGET_ROUTES;

export const targetRouter = [
  {
    path: BaseClientStats,
    element: <ClientsPage />,
  },
  {
    path: ClientStats,
    element: <ClientsPage />,
  },
];
