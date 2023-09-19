import {
  IClientsStatsReq,
  IClientsStatsRes,
  IClientStatsReq,
  IClientStatsRes,
} from '@features/clientStats';
import { setPeriodDate } from '@features/clientStats/lib/setPeriodDate';
import { baseApi } from '@shared/api/baseApi';

const STAT_URL = 'target/statistic/client';
export const ClientStatsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientStats: builder.query<IClientStatsRes[], IClientStatsReq>({
      query: (params) => {
        return {
          url: `${STAT_URL}/${params.id}/template`,
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: IClientStatsRes[], fetch, request) => {
        return response.map((client) => setPeriodDate(client, request.period));
      },
    }),
    getClientsStats: builder.query<IClientsStatsRes[], IClientsStatsReq>({
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
