import { createSlice } from '@reduxjs/toolkit';
import { ClientStatsAPI, IClientStatsResp } from '@features/clientStats';

export const statsSlice = createSlice({
  name: 'statistics',
  initialState: [] as IClientStatsResp[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ClientStatsAPI.endpoints.getClientStats.matchFulfilled,
        (state, { payload }) => payload,
      )
      .addMatcher(ClientStatsAPI.endpoints.getClientStats.matchRejected, () => []);
  },
});
