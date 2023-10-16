import {
  Client,
  ClientsStatsReq,
  ClientsStatsRes,
  ClientStatsReq,
  ClientStatsRes,
  SenlerStatsReq,
  SenlerStatsRes,
  setCostPerSub,
  setPeriodDate,
} from '@entities/client';
import { baseApi } from '@shared/api/baseApi';
import { CLIENT_TAG } from '@shared/api/tags';

const STAT_URL = 'target/statistic/client';
const SENLER_URL = 'target/senler/subscribers_count';

const collator = new Intl.Collator('ru', { caseFirst: 'upper' });

export const ClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], null>({
      query: () => ({
        url: 'target/client',
        method: 'GET',
      }),
      providesTags: [CLIENT_TAG],
      transformResponse: (response: Client[]) =>
        response.sort((a, b) => collator.compare(a.name, b.name)),
    }),
  }),
});

export const ClientStatsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientStats: builder.query<ClientStatsRes[], ClientStatsReq>({
      query: (params) => {
        return {
          url: `${STAT_URL}/${params.id}/template`,
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: ClientStatsRes[], fetch, request) => {
        return response.map((client) => setPeriodDate(client, request.period));
      },
    }),
    getClientsStats: builder.query<ClientsStatsRes[], ClientsStatsReq>({
      query: (params) => {
        return {
          url: `${STAT_URL}`,
          method: 'GET',
          params,
        };
      },
    }),
  }),
});

export const SenlerStatsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSenlerStats: builder.query<SenlerStatsRes[], SenlerStatsReq>({
      query: (params) => {
        return {
          url: SENLER_URL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: SenlerStatsRes[]) => {
        return response
          .map((res) => setCostPerSub(res))
          .sort((a, b) => collator.compare(a.client_name, b.client_name));
      },
    }),
  }),
});

export const { useGetClientsQuery, useLazyGetClientsQuery } = ClientAPI;
export const { useGetSenlerStatsQuery, useLazyGetSenlerStatsQuery } = SenlerStatsAPI;
export const { useLazyGetClientStatsQuery, useLazyGetClientsStatsQuery } = ClientStatsAPI;
