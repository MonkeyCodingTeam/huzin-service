import { createBrowserRouter } from 'react-router-dom';
import { targetRouter } from '@app/providers/targetRouter';
import { LoginPage } from '@pages/Auth';
import { StubPage } from '@pages/StubPage';
import { AUTH_ROUTES } from '@shared/const';
import { AuthLayout } from '@widgets/AuthLayout';
import { GuestLayout } from 'widgets/GuestLayout';

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
