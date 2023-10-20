import { GetClientGroupReq, Group } from '@entities/group';
import { baseApi } from '@shared/api/baseApi';

const GroupAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientGroup: builder.query<Group, GetClientGroupReq>({
      query: (req) => ({
        url: `target/client/${req.clientId}/group`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useLazyGetClientGroupQuery } = GroupAPI;
