import { CampaignAPI, CampaignTemplate } from '@entities/campaign';
import { updateCampaignTemplateTags } from '@features/campaign/api/updateTagsType';
import { baseApi } from '@shared/api/baseApi';

export const UpdateCampaignAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCampaign: builder.mutation<CampaignTemplate, Pick<CampaignTemplate, 'name'>>({
      query: (body) => ({
        url: 'target/company-template',
        method: 'POST',
        body,
      }),
    }),
    deleteCampaign: builder.mutation<CampaignTemplate, CampaignTemplate['id']>({
      query: (campaignTemplateId) => ({
        url: `target/company-template/${campaignTemplateId}`,
        method: 'DELETE',
      }),
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
            return campaigns.map((campaign) => {
              console.log(JSON.stringify(campaign));
              if (campaign.id === data.id) return data;
              return campaign;
            });
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
            return campaigns.map((campaign) => {
              console.log(JSON.stringify(campaign));
              if (campaign.id === data.id) return data;
              return campaign;
            });
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
