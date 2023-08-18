import { baseAuthApi } from '@shared/api/baseAuthApi';
import { AUTH_TAG } from '@shared/api/tags';
import { type LoginRequest, type Session } from './types';

export const AuthAPI = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Session, LoginRequest>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      invalidatesTags: [AUTH_TAG],
    }),
    csrf: build.query({
      query: () => ({
        url: 'sanctum/csrf-cookie',
        method: 'GET',
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      invalidatesTags: [AUTH_TAG],
    }),
  }),
});
