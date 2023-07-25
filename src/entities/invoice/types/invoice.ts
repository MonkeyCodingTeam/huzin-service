import { Client } from '@entities/client';

export interface Invoice {
  id: number;
  sum: number;
  budget: number;
  client_id: number;
  path: string;
  number: string | null;
  inn: string | null;
  description: string | null;
  vk_number: number | null;
  paid_at: string | null;
  vk_paid_at: string | null;
  client: Client;
}
