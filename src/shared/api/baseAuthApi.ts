import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseAuthQuery } from '@shared/api/baseAuthQuery';
import { USER_TAG } from '@shared/api/tags';

export const baseAuthApi = createApi({
  tagTypes: [USER_TAG],
  reducerPath: 'authApi',
  baseQuery: baseAuthQuery,
  endpoints: () => ({}),
});
