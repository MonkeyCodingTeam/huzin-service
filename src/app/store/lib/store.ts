import { Middleware, MiddlewareAPI, configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { message } from 'antd';
import logger from 'redux-logger';
import { campaignTemplatesSlice } from '@entities/campaignTemplate';
import { clientsSlice, selectedClientSlice } from '@entities/client';
import { userSlice } from '@entities/user';
import { invalidateAccessTokenListener } from '@features/auth/invalidateAccessToken/model/listener';
import { statsSlice } from '@features/clientStats';
import { baseApi } from '@shared/api/baseApi';
import { baseAuthApi } from '@shared/api/baseAuthApi';
import { env } from '@shared/const';


export function makeStore() {
  const store = configureStore({
    reducer: {
      [userSlice.name]: userSlice.reducer,
      [selectedClientSlice.name]: selectedClientSlice.reducer,
      [clientsSlice.name]: clientsSlice.reducer,
      [statsSlice.name]: statsSlice.reducer,
      [campaignTemplatesSlice.name]: campaignTemplatesSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [baseAuthApi.reducerPath]: baseAuthApi.reducer,
    },
    devTools: env.MODE === 'development',
    middleware: (getDefaultMiddleware) => {
      const middlewares = [
        baseApi.middleware,
        baseAuthApi.middleware,
        invalidateAccessTokenListener.middleware,
      ];
      if (env.MODE === 'development') {
        middlewares.push(logger);
      }
      return getDefaultMiddleware().concat(middlewares);
    },
  });

  setupListeners(store.dispatch);

  return store;
}

export const appStore = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof appStore.dispatch;
