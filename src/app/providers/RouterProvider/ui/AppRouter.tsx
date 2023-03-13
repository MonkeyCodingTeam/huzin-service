import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { appRoutes } from '@app/providers/RouterProvider';
import { Loader } from '@shared/ui';

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader color={'#4CA6E7'} />}>
      <Routes>
        {appRoutes.map((route) => (
          <Route path={route.path} element={route.element} key={`${route.path}-${Date.now()}`} />
        ))}
      </Routes>
    </Suspense>
  );
};
