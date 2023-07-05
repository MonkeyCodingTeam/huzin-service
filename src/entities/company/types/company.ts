import type { Client } from '@entities/client';

export interface Company extends Model {
  name: string;
  client_id: Client['id'];
  status: 0 | 1 | 2;
}
