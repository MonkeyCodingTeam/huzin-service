import '@app/styles/index.scss';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { appStore } from '@app/store';
import { AntdProvider } from './providers/antdProvider';
import { appRouter } from './providers/appRouter';

export function App() {
  return (
    <React.StrictMode>
      <ReduxProvider store={appStore}>
        <HelmetProvider>
          <AntdProvider>
            <RouterProvider router={appRouter} />
          </AntdProvider>
        </HelmetProvider>
      </ReduxProvider>
    </React.StrictMode>
  );
}
