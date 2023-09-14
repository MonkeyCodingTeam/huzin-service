import { createSlice } from '@reduxjs/toolkit';
import { CampaignTemplateAPI, initCampaignTemplateState } from '@entities/campaignTemplate';

export const campaignTemplatesSlice = createSlice({
  name: 'campaignTemplate',
  initialState: [initCampaignTemplateState],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        CampaignTemplateAPI.endpoints.getCampaignTemplates.matchFulfilled,
        (state, { payload }) => payload,
      )
      .addMatcher(CampaignTemplateAPI.endpoints.getCampaignTemplates.matchRejected, () => [
        initCampaignTemplateState,
      ]);
  },
});
