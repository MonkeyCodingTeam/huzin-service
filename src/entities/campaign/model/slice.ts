import { createSlice } from '@reduxjs/toolkit';
import { CampaignAPI, initCampaignTemplateState } from '@entities/campaign';

export const campaignTemplatesSlice = createSlice({
  name: 'campaignTemplate',
  initialState: [initCampaignTemplateState],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        CampaignAPI.endpoints.getCampaignTemplates.matchFulfilled,
        (state, { payload }) => payload,
      )
      .addMatcher(CampaignAPI.endpoints.getCampaignTemplates.matchRejected, () => [
        initCampaignTemplateState,
      ]);
  },
});
