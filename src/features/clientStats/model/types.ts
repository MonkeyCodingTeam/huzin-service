import { CampaignTemplate } from '@entities/campaignTemplate';
import { Client, Company } from '@entities/client';

export interface ClientStatsReq {
  id: number;
  period: Period;
  date_from: string;
  date_to: string;
  company_template_ids?: CampaignTemplate['id'][];
}

export interface ClientsStatsReq {
  period: Period;
  date_from: string;
  date_to: string;
  only_field?: string[];
}

export interface StatsRes {
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

type StatsType = 'ad' | 'campaign' | 'client' | 'office';

export interface ClientStatsRes {
  id: Company['id'];
  stats: StatsRes[];
  type: StatsType;
}

export interface ClientsStatsRes {
  id: Client['id'];
  stats: StatsRes[];
  type: StatsType;
}
