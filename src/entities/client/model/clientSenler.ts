import { CampaignTemplate } from '@entities/campaign/@x/client';

export interface SenlerStatsReq {
  period: Period;
  date_from: string;
  date_to: string;
  company_template_id?: CampaignTemplate['id'];
}

export interface SenlerStatsRes {
  client_id: number;
  client_name: string;
  group_id: number;
  spent: number;
  costPerSub: number;
  success: boolean;
  count_subscribe: number;
  count_unsubscribe: number;
}
