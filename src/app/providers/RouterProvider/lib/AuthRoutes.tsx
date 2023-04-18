import { AppRoute } from '@app/providers/RouterProvider/types';
import { LoginPage } from '@pages/Auth/LoginPage';

export const AuthRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
    protected: false,
  },
];
