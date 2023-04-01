import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/App';
import { RouterProvider } from '@app/providers/RouterProvider';
import { Provider } from 'react-redux';
import { store } from '@app/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider>
      <App />
    </RouterProvider>
  </Provider>,
);
