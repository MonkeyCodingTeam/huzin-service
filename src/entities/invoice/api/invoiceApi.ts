import { InvoiceType } from '@entities/invoice';
import { baseApi } from '@shared/api/baseApi';

export const InvoiceAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoice: builder.query<InvoiceType[], null>({
      query: () => ({
        url: 'target/invoice',
        method: 'GET',
      }),
    }),
  }),
});

// TODO Добавить Parse для разбора счета после нажатия "Добавить"
// TODO Добавить Paid после подтверждения оплаты
// TODO paid_at для проверки оплачено ли
//https://api.ads-huzin.ru/api/target/client/1608076618/invoice

export const { useGetInvoiceQuery } = InvoiceAPI;
