import { axiosTargetInstance } from '@shared/lib/axios';
import type { AxiosPromise } from 'axios';
import type {
  Client,
  ClientsStatisticResponse,
  GetStatisticByCompaniesProps,
  GetStatisticProps,
  InvoiceUpdatePayload,
} from '@entities/client';
import { User } from '@entities/user';
import { Company } from '@entities/company';

const BASE_URL = 'client';
const STAT_URL = 'statistic/client';

export const ClientAPI = {
  getClients: async (payload?: {
    user_id?: User['id'];
    with?: ('group' | 'invoices')[];
  }): AxiosPromise<Client[]> => {
    return axiosTargetInstance.get(BASE_URL, {
      params: payload,
    });
  },
  getClient: async (clientId: Client['id']): AxiosPromise<Client> => {
    return axiosTargetInstance.get(`${BASE_URL}/${clientId}`);
  },
  getCompanies: async (clientId: Client['id']): AxiosPromise<Company[]> =>
    axiosTargetInstance.get(`${BASE_URL}/${clientId}/company`),
  updateClient: async (
    id: Client['id'],
    payload: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>,
  ): AxiosPromise<Client> => {
    return axiosTargetInstance.patch(`${BASE_URL}/${id}`, payload);
  },
  getStatistics: async (
    id: Client['id'],
    payload: GetStatisticByCompaniesProps,
  ): AxiosPromise<ClientsStatisticResponse[]> => {
    const template = payload.company_template_id ? `/template/${payload.company_template_id}` : '';
    return axiosTargetInstance.get(`${STAT_URL}/${id}${template}`, {
      params: payload,
    });
  },
  getAllStatistics: async (payload: GetStatisticProps): AxiosPromise<ClientsStatisticResponse[]> =>
    axiosTargetInstance.get(STAT_URL, {
      params: payload,
    }),
  toggleWatcher: async (client: Client, user: User): AxiosPromise<boolean> =>
    axiosTargetInstance.patch(`${BASE_URL}/${client.id}/watcher/${user.id}`),
  updateInvoice: async (client: Client, payload: InvoiceUpdatePayload): AxiosPromise<Client> =>
    axiosTargetInstance.patch(`${BASE_URL}/${client.id}/recommendation`, payload),
  getCurrentInvoice: async (clientId: Client['id']): AxiosPromise<File> =>
    axiosTargetInstance.get(`target/invoice/client/${clientId}/current`, {
      responseType: 'blob',
    }),
};
