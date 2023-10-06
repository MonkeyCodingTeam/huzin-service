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
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            ClientAPI.util.updateQueryData('getClients', null, (draft) => {
              // update
              const client = draft?.find((item) => item?.id === args?.id);
              if (client) {
                client.critical_balance = args.critical_balance;
                client.month_plan = args.month_plan;
                client.budget_adjustment = args.budget_adjustment;
              }
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetClientsQuery, useLazyGetClientsQuery, useUpdateClientMutation } = ClientAPI;
