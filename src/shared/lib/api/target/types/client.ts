import { Client } from '@entities/client/types';
import { CompanyTemplate } from '@shared/lib/api/target/types/company';

export interface GetStatisticProps {
  date_to: AppDate;
  date_from: AppDate;
  metrics?: Metrics[];
  only_field?: string[];
}

type Metrics = 'all' | 'base' | 'events' | 'video' | 'uniques' | 'tps' | 'playable' | 'romi';

export interface GetStatisticByCompaniesProps extends GetStatisticProps {
  company_template_id?: CompanyTemplate['id'];
}

export interface ClientsStatisticResponse {
  items: Statistic[];
  total: Omit<StatisticResponse, 'date'>;
}

export interface Statistic {
  id: Client['id'];
  rows?: StatisticResponse[];
  total: Partial<BaseStatistic & UniquesStatistic>;
}

export interface StatisticResponse {
  base?: BaseStatistic;
  uniques?: UniquesStatistic;
  date: string;
}

export interface BaseStatistic {
  spent: number;
  shows: number;
  goals: number;
  clicks: number;
  cpc: number;
  cpm: number;
  cpa: number;
  ctr: number;
  cr: number;
}

export type SummeryFields = Pick<BaseStatistic, 'spent' | 'shows' | 'clicks'>;

export interface PeriodStatistic extends SummeryFields {
  date: string;
}

export interface UniquesStatistic {
  reach: number;
  total: number;
  increment: number;
  initial_total: number;
  frequency: number;
}
