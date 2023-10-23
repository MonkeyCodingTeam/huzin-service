import { Client } from '@entities/client';
import { Group } from '@entities/group';
import { CreateGroupReq, GetGroupReq, GetGroupRes, UpdateGroupReq } from '@features/group';
import { baseApi } from '@shared/api/baseApi';
import { GROUP_TAG } from '@shared/api/tags';

const VK_API_GROUP = 'vk_method/groups';
const ROUTE = {
  getById: `${VK_API_GROUP}.getById`,
};

const GroupAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVKGroupBy: builder.query<Group, GetGroupReq>({
      query: (payload) => ({
        url: ROUTE.getById,
        method: 'POST',
        body: {
          ...payload,
          fields: payload.fields?.join(','),
        },
      }),
      transformResponse: (response: GetGroupRes) => {
        // TODO переделать после обновления бэка
        const { id, city, screen_name, name, photo_200, site } = response.groups[0];
        const group: Group = {
          id,
          name,
          site,
          screen_name,
          photo: photo_200,
          link: `https://vk.com/${screen_name}`,
          city: city?.title,
        };
        return group;
      },
    }),

    createGroup: builder.mutation<Group, { clientId: Client['id']; body: CreateGroupReq }>({
      query: ({ clientId, body }) => ({
        url: `target/client/${clientId}/group`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [GROUP_TAG],
    }),

    deleteGroup: builder.mutation<boolean, Client>({
      query: (client) => ({
        url: `target/client/${client.id}/group/${client.group_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [GROUP_TAG],
    }),

    updateGroup: builder.mutation<Group, { groupId: Group['id']; body: Partial<UpdateGroupReq> }>({
      query: ({ groupId, body }) => ({
        url: `group/${groupId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [GROUP_TAG],
    }),
  }),
});

export const {
  useLazyGetVKGroupByQuery,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} = GroupAPI;
