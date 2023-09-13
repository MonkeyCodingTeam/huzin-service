import { createBrowserRouter } from 'react-router-dom';
// eslint-disable-next-line boundaries/element-types
import { AuthLayout, GuestLayout } from '@app/layouts';
import { targetRouter } from '@app/providers/targetRouter';
import { LoginPage } from '@pages/Auth';
import { StubPage } from '@pages/StubPage';
import { AUTH_ROUTES } from '@shared/const';

export const appRouter = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <StubPage />,
      },
      ...targetRouter,
    ],
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: AUTH_ROUTES.Login,
        element: <LoginPage />,
      },
    ],
  },
]);
