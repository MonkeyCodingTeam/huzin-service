import { FC, useEffect } from 'react';
import { Navigate, Outlet, RouteProps, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { ROUTES } from '@shared/const/routes';
import { AuthThunk } from '@processes/auth';

export const ProtectedRoutes: FC<RouteProps> = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(AuthThunk.getUser()).catch(() => {
        navigate(ROUTES.AUTH.Login);
      });
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return user?.id ? <Outlet /> : <Navigate to={ROUTES.AUTH.Login} />;
};
