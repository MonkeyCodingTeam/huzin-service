import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseAuthQuery } from '@shared/api/baseAuthQuery';
import { AUTH_TAG } from '@shared/api/tags';

export const baseAuthApi = createApi({
  tagTypes: [AUTH_TAG],
  reducerPath: 'authApi',
  baseQuery: baseAuthQuery,
  endpoints: () => ({}),
});
