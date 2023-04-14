import { FC, useEffect, useState } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { AuthThunk } from '@processes/auth';
import { Loader } from '@shared/ui';

export const ProtectedRoutes: FC<RouteProps> = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AuthThunk.getUser()).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return user?.id ? <Outlet /> : <Navigate to='/login' />;
};
