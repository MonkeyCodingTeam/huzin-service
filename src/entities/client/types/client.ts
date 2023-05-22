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
  zero_days: number;
  budget_adjustment: number;
  is_mine?: boolean;
  group_id?: number;
  token?: string;
}
