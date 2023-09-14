import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import {
  campaignTemplateSlice,
  selectedCampaignTemplateSlice,
} from '@entities/campaignTemplate/model/slice';
import { clientsSlice, selectedClientSlice } from '@entities/client';
import { userSlice } from '@entities/user';
import { invalidateAccessTokenListener } from '@features/auth/invalidateAccessToken/model/listener';
import { statsSlice } from '@features/clientStats';
import { baseApi } from '@shared/api/baseApi';
import { baseAuthApi } from '@shared/api/baseAuthApi';
import { env } from '@shared/const';
import { authSlice } from 'entities/auth';

export function makeStore() {
  const store = configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [userSlice.name]: userSlice.reducer,
      [selectedClientSlice.name]: selectedClientSlice.reducer,
      [clientsSlice.name]: clientsSlice.reducer,
      [statsSlice.name]: statsSlice.reducer,
      [campaignTemplateSlice.name]: campaignTemplateSlice.reducer,
      [selectedCampaignTemplateSlice.name]: selectedCampaignTemplateSlice.reducer,
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
