import {
  ClientsStatsReq,
  ClientsStatsRes,
  ClientStatsReq,
  ClientStatsRes,
  setPeriodDate,
} from '@features/clientStats';
import { baseApi } from '@shared/api/baseApi';

const STAT_URL = 'target/statistic/client';
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

export const { useLazyGetClientStatsQuery, useLazyGetClientsStatsQuery } = ClientStatsAPI;
