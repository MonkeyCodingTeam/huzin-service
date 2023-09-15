import { ICampaignTemplate } from '@entities/campaignTemplate';
import { IClient } from '@entities/client';

export interface IStatsReq {
  id: number;
  period: 'day' | 'week' | 'month' | 'year';
  date_from: string;
  date_to: string;
  company_template_ids?: ICampaignTemplate['id'][];
}

export interface IStatsResp {
  clicks: number;
  ctr: number;
  day_from: string;
  day_to: string;
  month: string;
  period_date: string;
  effective_cost_per_click: number;
  effective_cost_per_mille: number;
  impressions: number;
  reach: number;
  join_rate: number;
  spent: number;
}

export interface IClientStatsResp {
  id: IClient['id'];
  stats: IStatsResp[];
  type: 'ad' | 'campaign' | 'client' | 'office';
}
