import { CampaignTemplate } from '@entities/campaign';

export const updateCampaigns = (campaigns: CampaignTemplate[], newRecord: CampaignTemplate) => {
  return campaigns.map((campaign) => {
    if (campaign.id === newRecord.id) return newRecord;
    return campaign;
  });
};
