import { Client } from '@entities/client/@x/invoice';

export interface Invoice {
  id: number;
  sum: number;
  budget: number;
  client_id: number;
  order: number;
  path: string;
  number: string;
  inn: string;
  entrepreneur: string;
  description?: string;
  vk_number?: number;
  paid_at?: string;
  vk_paid_at?: string;
  // client: Client;
}

export type InvoiceInfo = Pick<Invoice, 'inn' | 'entrepreneur' | 'sum' | 'number' | 'description'>;

export type InvoiceWithFile = InvoiceInfo & { file?: File };

export interface ClientInvoice extends Client {
  searchField: string;
}
