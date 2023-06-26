import { User } from '@entities/user';
import { Group } from '@entities/group';

export interface Client extends Model {
  name: string;
  balance: number;
  critical_balance: number;
  all_limit: number;
  day_limit: number;
  day_spent: number;
  week_spent: number;
  month_spent: number;
  month_plan: number;
  budget_adjustment: number;
  recommended_budget: number | null;
  zero_days: number;
  is_budget_agreed: boolean | 0 | 1;
  current_invoice_id: number | null;
  token: string;
  has_telegram: boolean;
  paid_at: string | null;
  zero_balance_at: string | null;
  low_balance_at: string | null;

  group_id?: number;
  is_mine?: boolean;

  current_invoice?: Invoice;
  users?: User[];
  group?: Group;
}

export interface Invoice {
  id: number;
  budget: number;
  client_id: number;
  path: string;
  number: string | null;
  inn: string | null;
  customer: string | null;
  description: string | null;
  vk_number: number | null;
  is_paid: boolean;
  is_vk_paid: boolean;
}
