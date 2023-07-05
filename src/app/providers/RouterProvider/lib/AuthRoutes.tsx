import { LoginPage } from '@pages/Auth/LoginPage';
import type { AppRoute } from '@app/providers/RouterProvider';

export const AuthRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
];
