import { WatcherReq } from '@features/budgetCuts/model/types';
import { baseApi } from '@shared/api/baseApi';
import { CLIENT_TAG } from '@shared/api/tags';

export const BudgetCutsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    toggleWatcher: builder.mutation<boolean, WatcherReq>({
      query: (body) => ({
        url: `target/client/${body.client.id}/watcher/${body.user.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),
  }),
});

export const { useToggleWatcherMutation } = BudgetCutsAPI;
