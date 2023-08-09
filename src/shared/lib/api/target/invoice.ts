import { Client } from '@entities/client/types';
import { AxiosPromise } from 'axios/index';
import { axiosTargetInstance } from '@shared/lib/axios';
import { Invoice } from '@entities/invoice';

const BASE_URL = 'invoice';

export const InvoiceApi = {
  updateInvoice: async (
    invoiceId: Invoice['id'],
    payload: Pick<Invoice, 'inn' | 'number' | 'description'>,
  ): AxiosPromise<Invoice> => axiosTargetInstance.patch(`${BASE_URL}/${invoiceId}`, payload),
  deleteInvoice: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Client> =>
    axiosTargetInstance.delete(`${BASE_URL}/${invoiceId}`),
  invoicePaid: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`${BASE_URL}/${invoiceId}/paid`),
  invoiceVkPaid: async (
    invoiceId: Client['current_invoice_id'],
    vk_number: number,
  ): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`${BASE_URL}/${invoiceId}/vk_paid`, { vk_number }),
  uploadInvoice: async (clientId: Client['id'], invoice: File): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(
      `invoice/client/${clientId}`,
      { invoice },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),
};
