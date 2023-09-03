import '@app/styles/index.scss';
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { appStore } from '@app/store';
import { FullscreenLoader } from '@shared/ui';
import { appRouter } from './providers/appRouter';

export function App() {
  return (
    <React.StrictMode>
      <ReduxProvider store={appStore}>
        <HelmetProvider>
          <Suspense fallback={<FullscreenLoader />}>
            <RouterProvider router={appRouter} />
          </Suspense>
        </HelmetProvider>
      </ReduxProvider>
    </React.StrictMode>
  );
}
