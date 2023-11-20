import { baseAuthApi } from '@shared/api/baseAuthApi';
import { USER_TAG } from '@shared/api/tags';
import { User } from '../model/types';
import { type LoginRequest } from './types';

export const AuthAPI = baseAuthApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, LoginRequest>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: [USER_TAG],
    }),
    csrf: build.query({
      query: () => ({
        url: 'sanctum/csrf-cookie',
        method: 'GET',
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [USER_TAG],
    }),
  }),
});

export const { useLazyCsrfQuery, useLoginMutation, useLogoutMutation } = AuthAPI;
