import { FC } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router';
import { useAppSelector } from '@shared/lib/redux';

export const ProtectedRoutes: FC<RouteProps> = () => {
  const user = useAppSelector((state) => state.user);

  return user?.id ? <Outlet /> : <Navigate to='/login' />;
};
