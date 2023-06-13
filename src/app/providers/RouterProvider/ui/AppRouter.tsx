import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { AppRoute, AppRoutes, ProtectedAppRoutes } from '@app/providers/RouterProvider';
import { Loader } from '@shared/ui';
import css from './AppRouter.module.scss';
import { ProtectedRoutes } from '@app/providers/RouterProvider/ui/ProtectedRoutes';

export const AppRouter = () => {
  const renderRoutes = (routes: AppRoute[]) => {
    return routes.map((route, index) => {
      const routeKey = `route_${route.name}_${index}`;
      return (
        <Route path={route.path} element={route.element} key={routeKey}>
          {route.children &&
            route.children.map((childRoute, index) => {
              const routeKey = `route_${childRoute.path}_${index}`;
              return (
                <Route
                  index={childRoute.index}
                  path={childRoute.path}
                  element={childRoute.element}
                  key={routeKey}
                />
              );
            })}
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
