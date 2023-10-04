import { Client } from '@entities/client';
import { baseApi } from '@shared/api/baseApi';

const collator = new Intl.Collator('ru', { caseFirst: 'upper' });

export const ClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], null>({
      query: () => ({
        url: 'target/client',
        method: 'GET',
      }),
      transformResponse: (response: Client[]) =>
        response.sort((a, b) => collator.compare(a.name, b.name)),
    }),
  }),
});

export const { useGetClientsQuery, useLazyGetClientsQuery } = ClientAPI;
