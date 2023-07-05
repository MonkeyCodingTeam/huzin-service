import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/App';
import { RouterProvider } from '@app/providers/RouterProvider';
import { Provider } from 'react-redux';
import { store } from '@app/store';
import { HelmetProvider } from 'react-helmet-async';
import { Locale } from '@app/providers/Prime';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider>
          <Locale localeLang={'ru'}>
            <App />
          </Locale>
        </RouterProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
);
