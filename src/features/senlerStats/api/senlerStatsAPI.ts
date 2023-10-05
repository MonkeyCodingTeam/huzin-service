import { SenlerStatsReq, SenlerStatsRes, setCostPerSub } from '@features/senlerStats';
import { baseApi } from '@shared/api/baseApi';

const collator = new Intl.Collator();
const SENLER_URL = 'target/senler/subscribers_count';

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

export const { useGetSenlerStatsQuery, useLazyGetSenlerStatsQuery } = SenlerStatsAPI;
