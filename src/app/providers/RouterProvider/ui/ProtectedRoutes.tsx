import { FC } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router';

export const ProtectedRoutes: FC<RouteProps> = () => {
  const hasJWT = () => {
    return !!localStorage.getItem('token');
  };

  return hasJWT() ? <Outlet /> : <Navigate to='/login' replace />;
};
