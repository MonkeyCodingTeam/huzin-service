import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) => {
    const middlewares = [];
    if (__MODE__ === 'development') {
      middlewares.push(logger);
    }
    return getDefaultMiddleware({ serializableCheck: false }).concat(middlewares);
  },
});
