import { type BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { env } from '@shared/const';
import { getCookie } from '@shared/lib';

export const baseAuthQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = fetchBaseQuery({
  baseUrl: env.API_URL,
  credentials: 'include',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  prepareHeaders: (headers) => {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      headers.set('X-XSRF-TOKEN', decodeURIComponent(token));
    }
    return headers;
  },
});
