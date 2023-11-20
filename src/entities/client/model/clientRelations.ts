import { Invoice } from '@entities/invoice/@x/client';

interface ClientRelations {
  invoices: Invoice[];
}

export type ClientRelationsName = keyof ClientRelations;
