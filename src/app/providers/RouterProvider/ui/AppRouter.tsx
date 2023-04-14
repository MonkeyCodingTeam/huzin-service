import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { AppRoutes, ProtectedAppRoutes } from '@app/providers/RouterProvider';
import { Loader } from '@shared/ui';
import css from './AppRouter.module.scss';
import { AppRoute } from '@app/providers/RouterProvider/types';
import { ProtectedRoutes } from '@app/providers/RouterProvider/ui/ProtectedRoutes';

export const AppRouter = () => {
  const renderRoutes = (routes: AppRoute[]) => {
    return routes.map((route) => {
      return (
        <Route path={route.path} element={route.element} key={`${route.path}-${Date.now()}`}>
          {route.children &&
            route.children.map((childRoute) => (
              <Route
                index={childRoute.index}
                path={childRoute.path}
                element={childRoute.element}
                key={`${childRoute.path}-${Date.now()}`}
              />
            ))}
        </Route>
      );
    });
  };

  return (
    <Suspense fallback={<Loader containerClassName={css.loader} />}>
      <Routes>
        <Route element={<ProtectedRoutes />}>{renderRoutes(ProtectedAppRoutes)}</Route>
        {renderRoutes(AppRoutes)}
      </Routes>
    </Suspense>
  );
};
