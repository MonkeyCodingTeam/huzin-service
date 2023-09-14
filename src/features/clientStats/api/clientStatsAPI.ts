import { IClientStatsResp, IStatsReq } from '@features/clientStats';
import { setPeriodDate } from '@features/clientStats/lib/setPeriodDate';
import { baseApi } from '@shared/api/baseApi';

const STAT_URL = 'statistic/client';
export const ClientStatsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientStats: builder.query<IClientStatsResp[], IStatsReq>({
      query: (params) => {
        return {
          url: `target/${STAT_URL}/${params.id}/template`,
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: IClientStatsResp[], fetch, request) => {
        return response.map((client) => setPeriodDate(client, request.period));
      },
    }),
  }),
});

export const { useLazyGetClientStatsQuery } = ClientStatsAPI;
