import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@pages/Auth';
import { StubPage } from '@pages/StubPage';
import { AUTH_ROUTES } from '@shared/const';
import { AuthLayout } from '@widgets/AuthLayout';
import { GuestLayout } from '@widgets/GustLayout';

export const appRouter = () =>
  createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: <StubPage />,
        },
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
