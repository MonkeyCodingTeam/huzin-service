import { Client, Invoice } from '@entities/client';
import { AxiosPromise } from 'axios/index';
import { axiosAppInstance } from '@shared/lib/axios';

const BASE_URL = 'target/invoice';

export const InvoiceApi = {
  updateInvoice: async (
    invoiceId: Invoice['id'],
    payload: Pick<Invoice, 'inn' | 'customer' | 'number'>,
  ): AxiosPromise<Invoice> => axiosAppInstance.patch(`${BASE_URL}/${invoiceId}`, payload),
  deleteInvoice: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Client> =>
    axiosAppInstance.delete(`${BASE_URL}/${invoiceId}`),
  invoicePaid: async (invoiceId: Client['current_invoice_id']): AxiosPromise<Client> =>
    axiosAppInstance.post(`${BASE_URL}/${invoiceId}/paid`),
};
