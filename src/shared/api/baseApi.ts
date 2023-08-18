import { createApi, retry } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@shared/api/baseQueryWithReauth';
import { AUTH_TAG, USER_TAG } from '@shared/api/tags';

export const baseApi = createApi({
  tagTypes: [USER_TAG, AUTH_TAG],
  reducerPath: 'api',
  baseQuery: retry(baseQueryWithReauth, { maxRetries: 3 }),
  endpoints: () => ({}),
});
