import { Client } from '@entities/client/types';
import { CompanyTemplate } from '@shared/lib/api/target/types/company';

export interface GetStatisticProps {
  period: 'day' | 'week' | 'month' | 'year' | 'overall';
  date_to: AppDate;
  date_from: AppDate;
  only_field?: string[];
}

export interface GetStatisticByCompaniesProps extends GetStatisticProps {
  company_template_id?: CompanyTemplate['id'];
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
  month: string;
  effective_cost_per_click: number;
  effective_cost_per_mille: number;
  impressions: number;
  reach: number;
  join_rate: number;
  spent: number;
  senler?: number;
}
