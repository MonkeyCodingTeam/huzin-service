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

export const GroupAPI = {
  get: async (clientId: Client['id']): AxiosPromise<Group[]> => {
    return axiosAppInstance.get(`target/client/${clientId}/group`);
  },
  getBy: async (payload: GroupGetByProps): AxiosPromise<GroupGetByResponse[]> => {
    return axiosAppInstance.post(ROUTE.getById, { ...payload, fields: payload.fields?.join(',') });
  },
  create: async (clientId: Client['id'], payload: GroupCreate): AxiosPromise<Group> => {
    return axiosAppInstance.post(`target/client/${clientId}/group`, payload);
  },
  update: async (groupId: Group['id'], payload: Partial<Group>): AxiosPromise<Group> => {
    return axiosAppInstance.patch(`target/group/${groupId}`, payload);
  },
  delete: async (groupId: Group['id']): AxiosPromise<Group> => {
    return axiosAppInstance.delete(`target/group/${groupId}`);
  },
  getSubscribersCount: async (
    groupId: Group['id'],
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetSubscribersCountResponse> => {
    return axiosAppInstance.get(`target/senler/subscribers_count/${groupId}`, {
      params: payload,
    });
  },
  getSubscribersCountByPeriod: async (
    groupId: Group['id'],
    payload: GetSubscribersCountPriodRequest,
  ): AxiosPromise<Record<string, GetSubscribersCountResponse>> => {
    return axiosAppInstance.get(`target/senler/subscribers_count/${groupId}/period`, {
      params: payload,
    });
  },
  getAllSubscribersCount: async (
    payload: GetSubscribersCountRequest,
  ): AxiosPromise<GetAllSubscribersCountResponse> => {
    return axiosAppInstance.get(`target/senler/subscribers_count`, {
      params: payload,
    });
  },
};
