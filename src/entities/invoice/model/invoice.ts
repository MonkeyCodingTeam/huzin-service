import { Invoice, InvoiceInfo } from '@entities/invoice';
import { emptyClientState } from '@entities/client';

export const emptyInvoiceState: Invoice = {
  id: 0,
  sum: 0,
  budget: 0,
  client_id: 0,
  path: '',
  client: emptyClientState,
  number: '',
  inn: '',
  entrepreneur: '',
};

export const AddInvoiceState: InvoiceInfo = {
  number: '',
  inn: '',
  entrepreneur: '',
  description: '',
  sum: 0,
};
