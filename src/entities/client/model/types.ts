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
  entrepreneur: string;
  paid_at: string | null;
  zero_balance_at: string | null;
  low_balance_at: string | null;
  basic_payment?: number;
  group_id?: number;
  is_mine?: boolean;
  companies: Company[];
  users: User[];
}

// TODO Вопрос юзерам, нужно ли что-то менять в моделях

export interface User extends Model {
  name: string;
}

export interface Company extends Model {
  name: string;
  client_id: Client['id'];
  status: 0 | 1 | 2;
  company_template_id?: number;
}

export interface ClientUpdateReq extends Model {
  critical_balance: number;
  month_plan: number;
  budget_adjustment: number;
}
