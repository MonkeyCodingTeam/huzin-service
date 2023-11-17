import { Client, ClientRelationsName } from '@entities/client/@x/invoice';
import { InvoiceType } from '@entities/invoice';
import { ClientInvoice } from '@entities/invoice/model/invoice';
import { baseApi } from '@shared/api/baseApi';

export const InvoiceAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoice: builder.query<InvoiceType[], null>({
      query: () => ({
        url: 'target/invoice',
        method: 'GET',
      }),
    }),
    // TODO рассмотреть перенос на ClientApi
    getClientsWithInvoice: builder.query<ClientInvoice[], { with: ClientRelationsName[] }>({
      query: (params) => ({
        url: 'target/client',
        method: 'GET',
        params,
      }),
      transformResponse: (clients: Client[]): ClientInvoice[] => {
        const resCopy: ClientInvoice[] = [];
        clients.forEach((client) => {
          // TODO добавить ИНН
          resCopy.push({ ...client, searchField: client.name + client.entrepreneur });
        });
        return resCopy;
      },
    }),
  }),
});

// TODO Добавить Parse для разбора счета после нажатия "Добавить"
// TODO Добавить Paid после подтверждения оплаты
// TODO paid_at для проверки оплачено ли
//https://api.ads-huzin.ru/api/target/client/1608076618/invoice

export const { useGetInvoiceQuery, useGetClientsWithInvoiceQuery } = InvoiceAPI;
