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
  is_mine?: boolean;
}
