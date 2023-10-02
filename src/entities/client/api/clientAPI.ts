import { Client, ClientUpdateReq } from '@entities/client';
import { baseApi } from '@shared/api/baseApi';
import { CLIENT_TAG } from '@shared/api/tags';

const collator = new Intl.Collator('ru', { caseFirst: 'upper' });

export const ClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], null>({
      query: () => ({
        url: 'target/client',
        method: 'GET',
      }),
      providesTags: [CLIENT_TAG],
      transformResponse: (response: Client[]) =>
        response.sort((a, b) => collator.compare(a.name, b.name)),
    }),
    updateClient: builder.mutation<Client, ClientUpdateReq>({
      query: (body) => ({
        url: `target/client/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),
  }),
});

export const { useGetClientsQuery, useLazyGetClientsQuery, useUpdateClientMutation } = ClientAPI;
