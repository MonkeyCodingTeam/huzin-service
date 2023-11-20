import { Client } from '@entities/client';

export interface ClientInvoice extends Client {
  searchField: string;
}
