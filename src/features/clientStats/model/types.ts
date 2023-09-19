import { ICampaignTemplate } from '@entities/campaignTemplate';
import { Company, IClient } from '@entities/client';

export interface IClientStatsReq {
  id: number;
  period: TPeriod;
  date_from: string;
  date_to: string;
  company_template_ids?: ICampaignTemplate['id'][];
}

export interface IClientsStatsReq {
  period: TPeriod;
  date_from: string;
  date_to: string;
  only_field?: string[];
}

export interface IStatsRes {
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

export interface IClientStatsRes {
  id: Company['id'];
  stats: IStatsRes[];
  type: 'ad' | 'campaign' | 'client' | 'office';
}

export interface IClientsStatsRes {
  id: IClient['id'];
  stats: IStatsRes[];
  type: 'ad' | 'campaign' | 'client' | 'office';
}
