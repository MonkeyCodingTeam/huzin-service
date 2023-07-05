import {
  AdminRoutes,
  type AppRoute,
  AppRoutes,
  ContentRoutes,
  ProtectedAppRoutes,
  ProtectedRoutes,
  TargetRoutes,
} from '@app/providers/RouterProvider';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Loader } from '@shared/ui';
import css from './AppRouter.module.scss';

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
        <Route element={<ProtectedRoutes roles={['manager', 'accountant']} />}>
          {renderRoutes(TargetRoutes)}
        </Route>
        <Route element={<ProtectedRoutes roles={['content']} />}>
          {renderRoutes(ContentRoutes)}
        </Route>
        <Route element={<ProtectedRoutes roles={['admin']} />}>{renderRoutes(AdminRoutes)}</Route>
        <Route element={<ProtectedRoutes />}>{renderRoutes(ProtectedAppRoutes)}</Route>
        {renderRoutes(AppRoutes)}
      </Routes>
    </Suspense>
  );
};
