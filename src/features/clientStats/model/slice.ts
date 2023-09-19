import { createSlice } from '@reduxjs/toolkit';
import { ClientStatsAPI, IClientsStatsRes, IClientStatsRes } from '@features/clientStats';

export const clientStatsSlice = createSlice({
  name: 'clientStats',
  initialState: [] as IClientStatsRes[],
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

export const clientsStatsSlice = createSlice({
  name: 'clientsStats',
  initialState: [] as IClientsStatsRes[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ClientStatsAPI.endpoints.getClientsStats.matchFulfilled,
        (state, { payload }) => payload,
      )
      .addMatcher(ClientStatsAPI.endpoints.getClientsStats.matchRejected, () => []);
  },
});
