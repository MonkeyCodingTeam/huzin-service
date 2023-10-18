import { createSlice } from '@reduxjs/toolkit';
import { ClientsStatsRes, ClientStatsAPI, ClientStatsRes } from '@features/clientStats';

export const clientStatsSlice = createSlice({
  name: 'clientStats',
  initialState: [] as ClientStatsRes[],
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
  initialState: [] as ClientsStatsRes[],
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
