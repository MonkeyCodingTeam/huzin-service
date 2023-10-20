import { Group } from '@entities/group';
import { CreateGroupReq, GetGroupReq, GetGroupRes } from '@features/group';
import { baseApi } from '@shared/api/baseApi';

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
        ...payload,
        fields: payload.fields?.join(','),
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
    createGroup: builder.query<Group, CreateGroupReq>({
      query: (payload) => ({
        url: 'target/group',
        method: 'POST',
        payload,
      }),
    }),
  }),
});

export const { useLazyGetVKGroupByQuery, useLazyCreateGroupQuery } = GroupAPI;
