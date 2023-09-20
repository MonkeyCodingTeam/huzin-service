import { createSlice } from '@reduxjs/toolkit';
import { ClientAPI } from '@entities/client/api/clientAPI';
import { initClientState } from '@entities/client/model/inits';
import { Client } from '@entities/client/model/types';

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

export const { setSelectedClient } = selectedClientSlice.actions;
