import {
  type BaseQueryApi,
  type QueryReturnValue,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { type FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { invalidateAccessToken } from '@shared/api/invalideTokenEvent';
import { baseQuery } from './baseQuery';

const AUTH_ERROR_CODES = new Set([401]);

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
): Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  const result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    typeof result.error?.status === 'number' &&
    AUTH_ERROR_CODES.has(result.error.status)
  ) {
    api.dispatch(invalidateAccessToken);
  }

  return result;
};
