import { baseApi } from '@shared/api/baseApi';
import { CampaignTemplate } from '../model/types';

export const CampaignAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignTemplates: builder.query<CampaignTemplate[], null>({
      query: () => ({
        url: 'target/company-template',
        method: 'GET',
      }),
    }),
    getGuestCampaignTemplates: builder.query<CampaignTemplate[], { clientId: number }>({
      query: ({ clientId }) => ({
        url: `guest-stat/client/${clientId}/company-template`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCampaignTemplatesQuery, useLazyGetGuestCampaignTemplatesQuery } = CampaignAPI;
