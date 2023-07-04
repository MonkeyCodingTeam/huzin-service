import {
  CompanyTemplate,
  GetSubscribersCountPriodRequest,
  GetSubscribersCountResponse,
} from '@shared/lib/api/target/types';
import { AxiosPromise } from 'axios';
import { axiosTargetInstance } from '@shared/lib/axios';
import { Client, ClientsStatisticResponse, GetStatisticByCompaniesProps } from '@entities/client';
import { Group } from '@entities/group';
import { Company } from '@entities/company';

const BASE_URL = 'guest-stat';
const ROUTES = {
  CLIENT: `${BASE_URL}/client`,
};

export const GuestAPI = {
  getCompanyStats: async (
    clientId: Client['id'],
    payload: GetStatisticByCompaniesProps,
  ): AxiosPromise<ClientsStatisticResponse> => {
    const route = `${ROUTES.CLIENT}/${clientId}/stats${
      payload.company_template_id ? `/${payload.company_template_id}` : ''
    }`;
    return axiosTargetInstance.get(route, {
      params: payload,
    });
  },
  getClient: async (clientId: Client['id']): AxiosPromise<Client> => {
    return axiosTargetInstance.get(`${ROUTES.CLIENT}/${clientId}`);
  },
  getCompanyTemlpates: async (): AxiosPromise<CompanyTemplate[]> => {
    return axiosTargetInstance.get(`${BASE_URL}/company-template`);
  },
  getSubscribersCountByPeriod: async (
    groupId: Group['id'],
    payload: GetSubscribersCountPriodRequest,
  ): AxiosPromise<Record<string, GetSubscribersCountResponse>> => {
    const route = `${BASE_URL}/subscribers_count/${groupId}/period${
      payload.company_template_id ? `/${payload.company_template_id}` : ''
    }`;
    return axiosTargetInstance.get(route, {
      params: payload,
    });
  },
  getCompanies: async (clientId: Client['id']): AxiosPromise<Company[]> =>
    axiosTargetInstance.get(`${BASE_URL}/client/${clientId}/company`),
};
