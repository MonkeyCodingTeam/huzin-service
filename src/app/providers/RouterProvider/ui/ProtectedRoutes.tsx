import { type FC, useEffect } from 'react';
import { Navigate, Outlet, type RouteProps, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { ROUTES } from '@app/providers/RouterProvider';
import { AuthThunk } from '@processes/auth';
import type { Role } from '@entities/user';

export const ProtectedRoutes: FC<RouteProps & { roles?: Role['slug'][] }> = ({ roles = [] }) => {
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
  }, [navigate, dispatch]);

  useEffect(() => {
    const hasAccess = !!user.roles.find((role) => {
      if (!roles.length) return true;
      if (role.slug === 'admin') return true;

      return !!roles.find((slug) => slug === role.slug);
    });

    if (!hasAccess) {
      navigate('/');
    }
  }, [user.roles]);

  return user?.id ? <Outlet /> : <Navigate to={ROUTES.AUTH.Login} />;
};
