import { CampaignTemplate } from '@entities/campaignTemplate';
import { baseApi } from '@shared/api/baseApi';

export const CampaignTemplateAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignTemplates: builder.query<CampaignTemplate[], null>({
      query: () => ({
        url: 'target/company-template',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCampaignTemplatesQuery } = CampaignTemplateAPI;
