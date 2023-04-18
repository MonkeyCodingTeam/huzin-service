import { Client } from '@entities/client/types';

export interface GetStatisticProps {
  period: 'day' | 'week' | 'month' | 'year' | 'overall';
  date_to: AppDate;
  date_from: AppDate;
  only_field?: string[];
}

export interface ClientsStatisticResponse {
  id: Client['id'];
  stats: StatisticResponse[];
  type: 'ad' | 'campaign' | 'client' | 'office';
}

export interface StatisticResponse {
  clicks: number;
  ctr: number;
  day_from: string;
  day_to: string;
  effective_cost_per_click: number;
  effective_cost_per_mille: number;
  impressions: number;
  spent: number;
}
