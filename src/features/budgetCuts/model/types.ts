import { User } from '@entities/user';

export interface WatcherReq {
  clientId: number;
  user: User;
}
