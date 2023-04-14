import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/App';
import { RouterProvider } from '@app/providers/RouterProvider';
import { Provider } from 'react-redux';
import { store } from '@app/store';
import { PrimeLocale } from '@app/providers/Prime';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider>
          <PrimeLocale localeLang={'ru'}>
            <App />
          </PrimeLocale>
        </RouterProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
);
