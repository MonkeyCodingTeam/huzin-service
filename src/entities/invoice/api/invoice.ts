import { axiosTargetInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { Client } from '@entities/client';
import { Invoice } from '@entities/invoice';

export const InvoiceAPI = {
  get: (): AxiosPromise<(Invoice & { client: Client })[]> => axiosTargetInstance.get('invoice'),
  invoiceVkPaid: async (
    invoiceId: Client['current_invoice_id'],
    vk_number: number,
  ): AxiosPromise<Invoice> =>
    axiosTargetInstance.post(`invoice/${invoiceId}/vk_paid`, { vk_number }),
};
