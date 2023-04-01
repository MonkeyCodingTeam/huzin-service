import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { selectedClient } from '@entities/client/model';

export const appInitialState = {
  selectedClient: null,
};

export const store = configureStore({
  reducer: {
    selectedClient: selectedClient.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = [];
    if (__MODE__ === 'development') {
      middlewares.push(logger);
    }
    return getDefaultMiddleware({ serializableCheck: false }).concat(middlewares);
  },
});
