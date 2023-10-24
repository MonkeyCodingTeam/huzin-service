import { GetClientGroupReq, Group } from '@entities/group';
import { baseApi } from '@shared/api/baseApi';
import { GROUP_TAG } from '@shared/api/tags';

export const GroupAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientGroup: builder.query<Group, GetClientGroupReq>({
      query: (req) => ({
        url: `target/client/${req.clientId}/group`,
        method: 'GET',
      }),
      providesTags: [GROUP_TAG],
    }),
  }),
});

export const { useLazyGetClientGroupQuery } = GroupAPI;
