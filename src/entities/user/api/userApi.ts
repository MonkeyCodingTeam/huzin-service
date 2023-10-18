import { type User } from '@entities/user';
import { baseAuthApi } from '@shared/api/baseAuthApi';
import { USER_TAG } from '@shared/api/tags';

export const UserAPI = baseAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, null>({
      query() {
        return {
          url: 'api/me',
        };
      },
      providesTags: [USER_TAG],
    }),
    getUsers: builder.query<User[], null>({
      query: () => ({
        url: 'api/user',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetUsersQuery } = UserAPI;
