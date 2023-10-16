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
  }),
});

export const { useGetCampaignTemplatesQuery } = CampaignAPI;
