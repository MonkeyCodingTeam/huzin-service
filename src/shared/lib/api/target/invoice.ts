import { Client, Invoice } from '@entities/client';
import { AxiosPromise } from 'axios/index';
import { axiosAppInstance } from '@shared/lib/axios';

const BASE_URL = 'target/invoice';

export const InvoiceApi = {
  updateInvoice: async (
    invoiceId: Invoice['id'],
    payload: Pick<Invoice, 'inn' | 'customer' | 'number' | 'description'>,
  ): AxiosPromise<Invoice> => axiosAppInstance.patch(`${BASE_URL}/${invoiceId}`, payload),
  deleteInvoice: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Client> =>
    axiosAppInstance.delete(`${BASE_URL}/${invoiceId}`),
  invoicePaid: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Invoice> =>
    axiosAppInstance.post(`${BASE_URL}/${invoiceId}/paid`),
  invoiceVkPaid: async (
    invoiceId: Client['current_invoice_id'],
    vk_number: number,
  ): AxiosPromise<Invoice> =>
    axiosAppInstance.post(`${BASE_URL}/${invoiceId}/vk_paid`, { vk_number }),
  uploadInvoice: async (clientId: Client['id'], invoice: File): AxiosPromise<Invoice> =>
    axiosAppInstance.post(
      `target/invoice/client/${clientId}`,
      { invoice },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),
};
