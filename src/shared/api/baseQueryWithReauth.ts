import {
  type BaseQueryApi,
  type QueryReturnValue,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { type FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { message } from 'antd';
import { invalidateAccessToken } from '@shared/api/invalideTokenEvent';
import { baseQuery } from './baseQuery';
import { isFetchBaseQueryError } from './isFetchBaseQueryError';

const AUTH_ERROR_CODES = new Set([401]);

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
): Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  const result = await baseQuery(args, api, extraOptions);
  const { error } = result;

  if (error && typeof error?.status === 'number' && AUTH_ERROR_CODES.has(error.status)) {
    api.dispatch(invalidateAccessToken());
  }

  if (isFetchBaseQueryError(error)) {
    console.warn('We got a rejected action!', error);
    message.error(error.data.message);
  }

  return result;
};
