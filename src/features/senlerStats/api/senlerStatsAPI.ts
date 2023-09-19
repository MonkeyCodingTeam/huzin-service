import { ISenlerStatsReq, ISenlerStatsRes } from '@features/senlerStats';
import { baseApi } from '@shared/api/baseApi';

const SENLER_URL = 'target/senler/subscribers_count';
export const SenlerStatsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSenlerStats: builder.query<ISenlerStatsRes[], ISenlerStatsReq>({
      query: (params) => {
        return {
          url: SENLER_URL,
          method: 'GET',
          params,
        };
      },
    }),
  }),
});

export const { useGetSenlerStatsQuery, useLazyGetSenlerStatsQuery } = SenlerStatsAPI;
