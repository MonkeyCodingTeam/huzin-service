import type { AxiosPromise } from 'axios';
import { axiosAppInstance, axiosTargetInstance } from '@shared/lib/axios';
import type { Client } from '@entities/client';
import type {
  GetAllSubscribersCountResponse,
  GetSubscribersCountPriodRequest,
  GetSubscribersCountRequest,
  GetSubscribersCountResponse,
  Group,
  GroupCreate,
  GroupGetByProps,
  GroupGetByResponse,
} from '@entities/group';

const VKAPI_GROUP = 'vk_method/groups';
const ROUTE = {
  getById: `${VKAPI_GROUP}.getById`,
};

export const ClientGroupAPI = {
  get: async (clientId: Client['id']): AxiosPromise<Group> =>
    axiosTargetInstance.get(`client/${clientId}/group`),
  create: async (clientId: Client['id'], payload: GroupCreate): AxiosPromise<Group> =>
    axiosTargetInstance.post(`client/${clientId}/group`, payload),
  delete: async (client: Client): AxiosPromise<Group> =>
    axiosTargetInstance.delete(`client/${client.id}/group/${client.group_id}`),
  getSubscribersCount: async (
    groupId: Group['id'],
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetSubscribersCountResponse> =>
    axiosTargetInstance.get(`senler/subscribers_count/${groupId}`, {
      params: payload,
    }),
  getSubscribersCountByPeriod: async (
    groupId: Group['id'],
    payload: GetSubscribersCountPriodRequest,
  ): AxiosPromise<Record<string, GetSubscribersCountResponse>> =>
    axiosTargetInstance.get(`senler/subscribers_count/${groupId}/period`, {
      params: payload,
    }),
  getAllSubscribersCount: async (
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetAllSubscribersCountResponse> =>
    axiosTargetInstance.get(`senler/subscribers_count`, {
      params: payload,
    }),
};

export const GroupApi = {
  getAll: async (): AxiosPromise<Group[]> => axiosAppInstance.get('group'),
  get: async (groupId: Group['id']): AxiosPromise<Group> =>
    axiosAppInstance.get(`group/${groupId}`),
  getBy: async (payload: GroupGetByProps): AxiosPromise<GroupGetByResponse[]> =>
    axiosAppInstance.post(ROUTE.getById, {
      ...payload,
      fields: payload.fields?.join(','),
    }),
  update: async (groupId: Group['id'], payload: Partial<Group>): AxiosPromise<Group> =>
    axiosAppInstance.patch(`group/${groupId}`, payload),
  delete: async (groupId: Group['id']): AxiosPromise<Group> =>
    axiosAppInstance.delete(`group/${groupId}`),
  create: async (payload: GroupCreate): AxiosPromise<Group> =>
    axiosAppInstance.post('group', payload),
  getLinkedGroups: async (groupId: Group['id']): AxiosPromise<Group[]> =>
    axiosAppInstance.get(`group/${groupId}/link`),
  setLinkedGroups: async (
    groupId: Group['id'],
    payload: {
      groups: Group['id'][];
    },
  ): AxiosPromise<Group[]> => axiosAppInstance.post(`group/${groupId}/link`, payload),
};
