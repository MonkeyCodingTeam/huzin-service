import { Group } from '@entities/group';
import { CreateGroupReq } from '@features/group/model/groupCreate';
import { baseApi } from '@shared/api/baseApi';

const GroupAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.query<Group, CreateGroupReq>({
      query: (payload) => ({
        url: 'target/group',
        method: 'POST',
        payload,
      }),
    }),
  }),
});

export const { useLazyCreateGroupQuery } = GroupAPI;
