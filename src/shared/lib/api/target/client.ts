import { axiosAppInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import {
  ClientsStatisticResponse,
  GetStatisticByCompaniesProps,
  GetStatisticProps,
  InvoiceUpdatePayload,
} from '@shared/lib/api/target/types';
import { Client } from '@entities/client';
import { User } from '@entities/user';
import { Company } from '@entities/company';

const BASE_URL = 'target/client';
const STAT_URL = 'target/statistic/client';

export const ClientAPI = {
  getClients: async (payload?: {
    user_id?: User['id'];
    with?: 'currentInvoice'[];
  }): AxiosPromise<Client[]> => {
    return axiosAppInstance.get(BASE_URL, {
      params: payload,
    });
  },
  getClient: async (clientId: Client['id']): AxiosPromise<Client> => {
    return axiosAppInstance.get(`${BASE_URL}/${clientId}`);
  },
  getCompanies: async (clientId: Client['id']): AxiosPromise<Company[]> =>
    axiosAppInstance.get(`${BASE_URL}/${clientId}/company`),
  updateClient: async (
    id: Client['id'],
    payload: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>,
  ): AxiosPromise<Client> => {
    return axiosAppInstance.patch(`${BASE_URL}/${id}`, payload);
  },
  getStatistics: async (
    id: Client['id'],
    payload: GetStatisticByCompaniesProps,
  ): AxiosPromise<ClientsStatisticResponse[]> => {
    const template = payload.company_template_id ? `/template/${payload.company_template_id}` : '';
    return axiosAppInstance.get(`${STAT_URL}/${id}${template}`, {
      params: payload,
    });
  },
  getAllStatistics: async (payload: GetStatisticProps): AxiosPromise<ClientsStatisticResponse[]> =>
    axiosAppInstance.get(STAT_URL, {
      params: payload,
    }),
  toggleWatcher: async (client: Client, user: User): AxiosPromise<boolean> =>
    axiosAppInstance.patch(`${BASE_URL}/${client.id}/watcher/${user.id}`),
  updateInvoice: async (client: Client, payload: InvoiceUpdatePayload): AxiosPromise<Client> =>
    axiosAppInstance.patch(`${BASE_URL}/${client.id}/recommendation`, payload),
  uploadInvoice: async (clientId: Client['id'], invoice: File): AxiosPromise<Client> =>
    axiosAppInstance.post(
      `target/invoice/client/${clientId}`,
      { invoice },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),
  getCurrentInvoice: async (clientId: Client['id']): AxiosPromise<File> =>
    axiosAppInstance.get(`target/invoice/client/${clientId}/current`, {
      responseType: 'blob',
    }),
};
