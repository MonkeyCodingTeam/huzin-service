import { CompanyTemplate } from '@shared/lib/api/target/types';
import { AxiosPromise } from 'axios';
import { axiosAppInstance } from '@shared/lib/axios';
import { Client, ClientsStatisticResponse, GetStatisticByCompaniesProps } from '@entities/client';
import {
  GetSubscribersCountPriodRequest,
  GetSubscribersCountResponse,
  Group,
} from '@entities/group';

const BASE_URL = 'guest-stat';
const ROUTES = {
  CLIENT: `${BASE_URL}/client`,
};

export const GuestAPI = {
  getCompanyStats: async (
    clientId: Client['id'],
    payload: GetStatisticByCompaniesProps,
  ): AxiosPromise<ClientsStatisticResponse[]> => {
    const route = `${ROUTES.CLIENT}/${clientId}/stats${
      payload.company_template_id ? `/${payload.company_template_id}` : ''
    }`;
    return axiosAppInstance.get(route, {
      params: payload,
    });
  },
  getClient: async (clientId: Client['id']): AxiosPromise<Client> => {
    return axiosAppInstance.get(`${ROUTES.CLIENT}/${clientId}`);
  },
  getCompanyTemlpates: async (): AxiosPromise<CompanyTemplate[]> => {
    return axiosAppInstance.get(`${BASE_URL}/company-template`);
  },
  getSubscribersCountByPeriod: async (
    groupId: Group['id'],
    payload: GetSubscribersCountPriodRequest,
  ): AxiosPromise<Record<string, GetSubscribersCountResponse>> => {
    const route = `${BASE_URL}/subscribers_count/${groupId}/period${
      payload.company_template_id ? `/${payload.company_template_id}` : ''
    }`;
    return axiosAppInstance.get(route, {
      params: payload,
    });
  },
};
