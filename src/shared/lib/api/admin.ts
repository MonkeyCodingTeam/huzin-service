import { axiosTargetInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { Client } from '@entities/client';

const BASE = '/admin';

export const AdminAPI = {
  getInvoiceReport: (): AxiosPromise<Client[]> => axiosTargetInstance.get(`${BASE}/report/invoice`),
};
