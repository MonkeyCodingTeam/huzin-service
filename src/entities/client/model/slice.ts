import { createSlice } from '@reduxjs/toolkit';
import {
  Client,
  ClientAPI,
  ClientsStatsRes,
  ClientStatsAPI,
  ClientStatsRes,
  initClientState,
  SenlerStatsAPI,
  SenlerStatsRes,
} from '@entities/client';

export const selectedClientSlice = createSlice({
  name: 'selectedClient',
  initialState: initClientState,
  reducers: {
    setSelectedClient: (state, { payload }) => payload,
  },
  extraReducers: {},
});

export const clientsSlice = createSlice({
  name: 'clients',
  initialState: [] as Client[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(ClientAPI.endpoints.getClients.matchFulfilled, (state, { payload }) => payload)
      .addMatcher(ClientAPI.endpoints.getClients.matchRejected, () => []);
  },
});

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

export const senlerStatsSlice = createSlice({
  name: 'senlerStats',
  initialState: [] as SenlerStatsRes[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      SenlerStatsAPI.endpoints.getSenlerStats.matchFulfilled,
      (state, { payload }) => payload,
    );
    builder.addMatcher(SenlerStatsAPI.endpoints.getSenlerStats.matchRejected, () => []);
  },
});

export const { setSelectedClient } = selectedClientSlice.actions;
