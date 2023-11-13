import { CampaignAPI, CampaignTemplate } from '@entities/campaign';
import { updateCampaigns } from '@features/campaign';
import { baseApi } from '@shared/api/baseApi';
import { updateCampaignTemplateTags } from './updateTagsType';

export const UpdateCampaignAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCampaign: builder.mutation<CampaignTemplate, Pick<CampaignTemplate, 'name'>>({
      query: (body) => ({
        url: 'target/company-template',
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        dispatch(
          CampaignAPI.util.updateQueryData('getCampaignTemplates', null, (campaigns) => {
            campaigns.push(data);
            return campaigns;
          }),
        );
      },
    }),

    deleteCampaign: builder.mutation<CampaignTemplate, CampaignTemplate['id']>({
      query: (campaignTemplateId) => ({
        url: `target/company-template/${campaignTemplateId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        await queryFulfilled;
        dispatch(
          CampaignAPI.util.updateQueryData('getCampaignTemplates', null, (campaigns) => {
            return campaigns.filter((campaign) => {
              if (campaign.id !== args) return campaign;
            });
          }),
        );
      },
    }),

    toggleSenler: builder.mutation<CampaignTemplate, CampaignTemplate['id']>({
      query: (campaignTemplateId) => ({
        url: `target/company-template/${campaignTemplateId}/toggle-senler`,
        method: 'PATCH',
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        dispatch(
          CampaignAPI.util.updateQueryData('getCampaignTemplates', null, (campaigns) => {
            return updateCampaigns(campaigns, data);
          }),
        );
      },
    }),

    updateTags: builder.mutation<
      CampaignTemplate,
      { body: updateCampaignTemplateTags; campaignTemplateId: CampaignTemplate['id'] }
    >({
      query: ({ body, campaignTemplateId }) => ({
        url: `target/company-template/${campaignTemplateId}/tag`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        dispatch(
          CampaignAPI.util.updateQueryData('getCampaignTemplates', null, (campaigns) => {
            return updateCampaigns(campaigns, data);
          }),
        );
      },
    }),
  }),
});

export const {
  useAddCampaignMutation,
  useDeleteCampaignMutation,
  useToggleSenlerMutation,
  useUpdateTagsMutation,
} = UpdateCampaignAPI;
