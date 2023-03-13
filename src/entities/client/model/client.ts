import { Client } from '@shared/lib/api/target/types/client';

export const emptyClientState: Client = {
  id: 0,
  name: '',
  all_limit: 0,
  balance: 0,
  critical_balance: 0,
  day_limit: 0,
  day_spent: 0,
  month_plan: 0,
  month_spent: 0,
  week_spent: 0,
};
