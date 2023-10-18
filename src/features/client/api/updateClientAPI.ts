import { Client, ClientAPI } from '@entities/client';
import { ClientUpdateReq, setSelectedClient, WatcherReq } from '@features/client';
import { baseApi } from '@shared/api/baseApi';

export const UpdateClientAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    toggleWatcher: builder.mutation<boolean, WatcherReq>({
      query: (body) => ({
        url: `target/client/${body.clientId}/watcher/${body.user.id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data: isToggle } = await queryFulfilled;
          dispatch(
            ClientAPI.util.updateQueryData('getClients', null, (draft) => {
              // update
              const client = draft?.find((item) => item?.id === args?.clientId);
              if (!client) return;
              if (isToggle) {
                client.is_mine = true;
                client.users.push(args.user);
              } else {
                client.is_mine = false;
                client.users = client.users.filter((user) => user.id != args.user.id);
              }
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateExpenses: builder.mutation<Client, ClientUpdateReq>({
      query: (body) => ({
        url: `target/client/${body.id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        dispatch(setSelectedClient(data));
        dispatch(
          ClientAPI.util.updateQueryData('getClients', null, (clients) => {
            return clients.map((client) => {
              if (client.id === data.id) return data;
              return client;
            });
          }),
        );
      },
    }),
  }),
});

export const { useToggleWatcherMutation, useUpdateExpensesMutation } = UpdateClientAPI;
