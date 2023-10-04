import { SenlerPage } from '@pages/Target/SenlerPage';
import { TARGET_ROUTES } from '@shared/const';
import { ClientsPage } from 'pages/Target/ClientsPage';

const { BaseClientStats, ClientStats, SenlerStats } = TARGET_ROUTES;

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
];
