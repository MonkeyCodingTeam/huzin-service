import { axiosAppInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import {
  ClientsStatisticResponse,
  GetStatisticProps,
  StatisticResponse,
} from '@shared/lib/api/target/types';
import { Client } from '@entities/client';
import { User } from '@entities/user';
import { Company } from '@entities/company';

const BASE_URL = 'target/client';
const STAT_URL = 'target/statistic/client';

export const ClientAPI = {
  getClients: async (payload?: { user_id?: User['id'] }): AxiosPromise<Client[]> => {
    return axiosAppInstance.get(BASE_URL, {
      params: payload,
    });
  },
  updateClient: async (
    id: Client['id'],
    payload: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>,
  ): AxiosPromise<Client> => {
    return axiosAppInstance.patch(`${BASE_URL}/${id}`, payload);
  },
  getStatistics: async (
    id: Client['id'],
    payload: GetStatisticProps,
  ): AxiosPromise<StatisticResponse[]> => {
    return axiosAppInstance.get(`${STAT_URL}/${id}`, {
      params: payload,
    });
  },
  getAllStatistics: async (payload: GetStatisticProps): AxiosPromise<ClientsStatisticResponse[]> =>
    axiosAppInstance.get(STAT_URL, {
      params: payload,
    }),
  toggleWatcher: async (client: Client, user: User) =>
    axiosAppInstance.patch(`${BASE_URL}/${client.id}/watcher/${user.id}`),
  getCompanies: async (clientId: Client['id']): AxiosPromise<Company[]> =>
    axiosAppInstance.get(`${BASE_URL}/${clientId}/company`),
};
