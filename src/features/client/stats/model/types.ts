import { User } from '@entities/user';

export interface ClientUpdateReq extends Model {
  critical_balance: number;
  month_plan: number;
  budget_adjustment: number;
}

export interface WatcherReq {
  clientId: number;
  user: User;
}
