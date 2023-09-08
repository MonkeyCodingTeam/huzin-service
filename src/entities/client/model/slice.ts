import { createSlice } from '@reduxjs/toolkit';
import { ClientAPI } from '@entities/client/api/clientAPI';
import { initClientState, initClientStatsState } from '@entities/client/model/inits';
import { IClient } from '@entities/client/model/types';

export const clientSlice = createSlice({
  name: 'client',
  initialState: initClientState,
  reducers: {},
  extraReducers: {},
});

export const clientsSlice = createSlice({
  name: 'clients',
  initialState: [] as IClient[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(ClientAPI.endpoints.getClients.matchFulfilled, (state, { payload }) => payload)
      .addMatcher(ClientAPI.endpoints.getClients.matchRejected, () => []);
  },
});

export const statsSlice = createSlice({
  name: 'statistics',
  initialState: [initClientStatsState],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ClientAPI.endpoints.getClientStats.matchFulfilled,
        (state, { payload }) => payload,
      )
      .addMatcher(ClientAPI.endpoints.getClients.matchRejected, () => [initClientStatsState]);
  },
});
