import { CampaignTemplate } from '@entities/campaign/@x/client';
import { Client } from '@entities/client';

type StatsType = 'ad' | 'campaign' | 'client' | 'office';

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
  uniq_views_count: number;
}

export interface ClientStatsRes {
  id: CampaignTemplate['id'];
  stats: StatsRes[];
  type: StatsType;
}

export interface ClientsStatsRes {
  id: Client['id'];
  stats: StatsRes[];
  type: StatsType;
}
