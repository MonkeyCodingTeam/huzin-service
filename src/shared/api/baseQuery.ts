import { type BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import queryString from 'query-string';
import { env } from '@shared/const';
import { getCookie } from '@shared/lib';

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = fetchBaseQuery({
  baseUrl: `${env.API_URL}/api`,
  credentials: 'include',
  headers: {
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
