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
  days_in_low_balance: number;
  days_in_zero_balance: number;
  is_budget_agreed: boolean | 0 | 1;
  current_invoice_id: number | null;

  group_id?: number;
  is_mine?: boolean;

  current_invoice?: Invoice;
}

export interface Invoice {
  id: number;
  budget: number;
  client_id: number;
  path: string;
  number: string;
  inn: string;
  customer: string;
  is_paid: boolean;
}
