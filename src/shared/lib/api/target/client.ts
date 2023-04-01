import { axiosAppInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import {
  Client,
  ClientsStatisticResponse,
  GetStatisticProps,
  StatisticResponse,
} from '@shared/lib/api/target/types';

const BASE_URL = 'target/client';
const STAT_URL = 'target/statistic/client';

export const ClientAPI = {
  getClients: async (): AxiosPromise<Client[]> => {
    return axiosAppInstance.get(BASE_URL);
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
  getAllStatistics: async (
    payload: GetStatisticProps,
  ): AxiosPromise<ClientsStatisticResponse[]> => {
    return axiosAppInstance.get(STAT_URL, {
      params: payload,
    });
  },
};
