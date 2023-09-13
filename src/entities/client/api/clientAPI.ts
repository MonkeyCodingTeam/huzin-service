import { IClient, IClientStatsResp, IStatsReq } from '@entities/client';
import { setPeriodDate } from '@entities/client/lib/setPeriodDate';
import { baseApi } from '@shared/api/baseApi';

const STAT_URL = 'statistic/client';
const collator = new Intl.Collator('ru', { caseFirst: 'upper' });

export const ClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<IClient[], null>({
      query: () => ({
        url: 'target/client',
        method: 'GET',
      }),
      transformResponse: (response: IClient[]) =>
        response.sort((a, b) => collator.compare(a.name, b.name)),
    }),
    getClientStats: builder.query<IClientStatsResp[], IStatsReq>({
      query: (params) => ({
        url: `target/${STAT_URL}/${params.id}/template`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: IClientStatsResp[], fetch, request) => {
        return response.map((client) => setPeriodDate(client, request.period));
      },
    }),
  }),
});

export const { useGetClientsQuery, useGetClientStatsQuery, useLazyGetClientStatsQuery } = ClientAPI;
