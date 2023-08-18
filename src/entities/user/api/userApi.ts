import { type User } from '@entities/user';
import { baseAuthApi } from '@shared/api/baseAuthApi';
import { AUTH_TAG } from '@shared/api/tags';

export const UserAPI = baseAuthApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<User, null>({
      query() {
        return {
          url: 'api/me',
        };
      },
      providesTags: [AUTH_TAG],
    }),
  }),
});
