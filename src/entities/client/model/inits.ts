import { IClient, IClientStatResp, IStatResp } from '@entities/client';

export const initClientState: IClient = {
  id: 0,
  name: '',
  entrepreneur: '',
  all_limit: 0,
  balance: 0,
  critical_balance: 0,
  day_limit: 0,
  day_spent: 0,
  month_plan: 0,
  month_spent: 0,
  week_spent: 0,
  zero_days: 0,
  budget_adjustment: 0,
  is_budget_agreed: false,
  has_telegram: false,
  token: '',
  recommended_budget: null,
  current_invoice_id: null,
  low_balance_at: null,
  paid_at: null,
  zero_balance_at: null,
};

export const initStatsState: IStatResp = {
  clicks: 0,
  ctr: 0,
  day_from: '',
  day_to: '',
  month: '',
  period: '',
  effective_cost_per_click: 0,
  effective_cost_per_mille: 0,
  impressions: 0,
  reach: 0,
  join_rate: 0,
  spent: 0,
};

export const initClientStatsState: IClientStatResp = {
  id: 0,
  type: 'client',
  stats: [initStatsState],
};
