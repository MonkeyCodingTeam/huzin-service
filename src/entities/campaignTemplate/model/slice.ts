import { createSlice } from '@reduxjs/toolkit';
import { CampaignTemplateAPI, initCampaignTemplateState } from '@entities/campaignTemplate';

export const campaignTemplateSlice = createSlice({
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

export const selectedCampaignTemplateSlice = createSlice({
  name: 'selectedCampaignTemplate',
  initialState: initCampaignTemplateState,
  reducers: {
    setSelectedCampaignTemplate: (state, { payload }) => payload,
  },
});

export const { setSelectedCampaignTemplate } = selectedCampaignTemplateSlice.actions;
