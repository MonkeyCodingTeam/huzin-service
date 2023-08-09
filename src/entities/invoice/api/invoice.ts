import { axiosTargetInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { Client } from '@entities/client';
import { Invoice, InvoiceInfo, InvoiceWithFile } from '@entities/invoice';

export const InvoiceAPI = {
  get: (): AxiosPromise<Invoice[]> => axiosTargetInstance.get('invoice'),
  create: (clientId: Client['id'], payload: InvoiceWithFile): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`client/${clientId}/invoice`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (invoiceId: Invoice['id']): AxiosPromise<Invoice> =>
    axiosTargetInstance.delete(`invoice/${invoiceId}`),
  paid: (invoiceId: Invoice['id']): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`invoice/${invoiceId}/paid`),
  vkPaid: async (invoiceId: Invoice['id'], vk_number: number): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`invoice/${invoiceId}/vk_paid`, { vk_number }),
  parse: (file: File): AxiosPromise<InvoiceInfo> =>
    axiosTargetInstance.post(
      'invoice/parse',
      { file },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),
  reorder: (invoiceIds: Invoice['id'][]): AxiosPromise<Invoice[]> =>
    axiosTargetInstance.post('invoice/reorder', {
      invoices: invoiceIds,
    }),
  archive: (clientId: Client['id']): AxiosPromise<Invoice[]> =>
    axiosTargetInstance.get(`client/${clientId}/invoice/archive`),
};
