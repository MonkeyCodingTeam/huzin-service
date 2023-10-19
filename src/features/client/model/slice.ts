import { createSlice } from '@reduxjs/toolkit';
import { initClientState } from '@entities/client';

export const selectedClientSlice = createSlice({
  name: 'selectedClient',
  initialState: initClientState,
  reducers: {
    setSelectedClient: (state, { payload }) => payload,
  },
  extraReducers: {},
});

export const { setSelectedClient } = selectedClientSlice.actions;
