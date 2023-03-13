import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/App';
import { RouterProvider } from '@app/providers/RouterProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider>
    <App />
  </RouterProvider>,
);
