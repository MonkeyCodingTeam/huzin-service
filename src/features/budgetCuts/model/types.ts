import { Client } from '@entities/client';
import { User } from '@entities/user';

export interface WatcherReq {
  client: Client;
  user: User;
}
