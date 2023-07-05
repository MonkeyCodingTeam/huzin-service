import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { selectedClient } from '@entities/client';
import { userModel } from '@entities/user';

export const appInitialState = {
  selectedClient: null,
  user: null,
};

export const store = configureStore({
  reducer: {
    selectedClient: selectedClient.reducer,
    user: userModel.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = [];
    if (__MODE__ === 'development') {
      middlewares.push(logger);
    }
    return getDefaultMiddleware({ serializableCheck: false }).concat(middlewares);
  },
});
