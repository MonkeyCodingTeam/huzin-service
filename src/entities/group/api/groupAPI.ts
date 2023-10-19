import { baseApi } from '@shared/api/baseApi';
import { GetGroupReq, GetGroupRes } from '../model/group';

const VK_API_GROUP = 'vk_method/groups';
const ROUTE = {
  getById: `${VK_API_GROUP}.getById`,
};

const VKGroupAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVKGroupBy: builder.query<GetGroupRes, GetGroupReq>({
      query: (payload) => ({
        url: ROUTE.getById,
        method: 'POST',
        ...payload,
        fields: payload.fields?.join(','),
      }),
    }),
  }),
});

export const { useLazyGetVKGroupByQuery } = VKGroupAPI;
