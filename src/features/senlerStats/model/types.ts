import { ICampaignTemplate } from '@entities/campaignTemplate';

export interface ISenlerStatsReq {
  date_from: string;
  date_to: string;
  company_template_id?: ICampaignTemplate['id'];
}

export interface ISenlerSubsCountRes {
  success: boolean;
  count_subscribe: number;
  count_unsubscribe: number;
}

export interface ISenlerStatsRes {
  client_id: number;
  group_id: number;
  stats: ISenlerSubsCountRes;
}
