import {
  GetAllSubscribersCountResponse,
  GetSubscribersCountPriodRequest,
  GetSubscribersCountRequest,
  GetSubscribersCountResponse,
  GroupCreate,
  GroupGetByProps,
  GroupGetByResponse,
} from '@shared/lib/api/target/types/group';
import { AxiosPromise } from 'axios';
import { axiosAppInstance } from '@shared/lib/axios';
import { Client } from '@entities/client/types';
import { Group } from '@entities/group/types';

const VKAPI_GROUP = 'vk_method/groups';
const ROUTE = {
  getById: `${VKAPI_GROUP}.getById`,
};

export const ClientGroupAPI = {
  get: async (clientId: Client['id']): AxiosPromise<Group> =>
    axiosAppInstance.get(`target/client/${clientId}/group`),
  getBy: async (payload: GroupGetByProps): AxiosPromise<GroupGetByResponse[]> =>
    axiosAppInstance.post(ROUTE.getById, {
      ...payload,
      fields: payload.fields?.join(','),
    }),
  create: async (clientId: Client['id'], payload: GroupCreate): AxiosPromise<Group> =>
    axiosAppInstance.post(`target/client/${clientId}/group`, payload),
  delete: async (client: Client): AxiosPromise<Group> =>
    axiosAppInstance.delete(`target/client/${client.id}/group/${client.group_id}`),
  getSubscribersCount: async (
    groupId: Group['id'],
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetSubscribersCountResponse> =>
    axiosAppInstance.get(`target/senler/subscribers_count/${groupId}`, {
      params: payload,
    }),
  getSubscribersCountByPeriod: async (
    groupId: Group['id'],
    payload: GetSubscribersCountPriodRequest,
  ): AxiosPromise<Record<string, GetSubscribersCountResponse>> =>
    axiosAppInstance.get(`target/senler/subscribers_count/${groupId}/period`, {
      params: payload,
    }),
  getAllSubscribersCount: async (
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetAllSubscribersCountResponse> =>
    axiosAppInstance.get(`target/senler/subscribers_count`, {
      params: payload,
    }),
};

export const GroupApi = {
  getAll: async (): AxiosPromise<Group[]> => axiosAppInstance.get('group'),
  get: async (groupId: Group['id']): AxiosPromise<Group> =>
    axiosAppInstance.get(`group/${groupId}`),
  update: async (groupId: Group['id'], payload: Partial<Group>): AxiosPromise<Group> =>
    axiosAppInstance.patch(`group/${groupId}`, payload),
};
