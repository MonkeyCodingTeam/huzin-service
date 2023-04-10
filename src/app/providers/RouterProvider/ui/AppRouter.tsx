import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { appRoutes } from '@app/providers/RouterProvider';
import { Loader } from '@shared/ui';
import css from './AppRouter.module.scss';
import { Header } from '@widgets';

export const AppRouter = () => {
  const renderRoutes = () => {
    return appRoutes.map((route) => {
      const element = route.header ? <Header>{route.element}</Header> : route.element;

      if (route.children) {
        return (
          <Route path={route.path} element={element} key={`${route.path}-${Date.now()}`}>
            {route.children.map((childRoute) => (
              <Route
                index={childRoute.index}
                path={childRoute.path}
                element={childRoute.element}
                key={`${childRoute.path}-${Date.now()}`}
              />
            ))}
          </Route>
        );
      }

      return <Route path={route.path} element={element} key={`${route.path}-${Date.now()}`} />;
    });
  };

  return (
    <Suspense fallback={<Loader containerClassName={css.loader} />}>
      <Routes>{renderRoutes()}</Routes>
    </Suspense>
  );
};
