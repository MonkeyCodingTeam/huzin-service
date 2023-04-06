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

export interface Client {
  id: number;
  name: string;
  balance: number;
  critical_balance: number;
  all_limit: number;
  day_limit: number;
  day_spent: number;
  week_spent: number;
  month_spent: number;
  month_plan: number;
  created_at?: Date;
  updated_at?: Date;
}
