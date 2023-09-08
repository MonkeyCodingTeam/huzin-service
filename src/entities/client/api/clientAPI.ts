import { IClient, IClientStatResp, IStatReq } from '@entities/client';
import { baseApi } from '@shared/api/baseApi';

const STAT_URL = 'statistic/client';

export const ClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<IClient[], null>({
      query: () => ({
        url: 'target/client',
        method: 'GET',
      }),
    }),
    getClientStats: builder.query<IClientStatResp[], IStatReq>({
      query: (params) => ({
        url: `target/${STAT_URL}/${params.id}/template`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetClientsQuery, useGetClientStatsQuery } = ClientAPI;
