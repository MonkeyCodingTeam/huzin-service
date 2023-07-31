import { axiosTargetInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { Client } from '@entities/client';
import { Invoice, InvoiceInfo, InvoiceWithFile } from '@entities/invoice';

export const InvoiceAPI = {
  get: (): AxiosPromise<(Invoice & { client: Client })[]> => axiosTargetInstance.get('invoice'),
  create: (clientId: Client['id'], payload: InvoiceWithFile): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`client/${clientId}/invoice`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (invoiceId: Invoice['id']): AxiosPromise<Invoice> =>
    axiosTargetInstance.delete(`invoice/${invoiceId}`),
  invoiceVkPaid: async (
    invoiceId: Client['current_invoice_id'],
    vk_number: number,
  ): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`invoice/${invoiceId}/vk_paid`, { vk_number }),
  parse: (file: File): AxiosPromise<InvoiceInfo> =>
    axiosTargetInstance.post(
      'invoice/parse',
      { file },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),
};
