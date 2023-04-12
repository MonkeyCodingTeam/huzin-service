import { createSlice } from '@reduxjs/toolkit';
import { Client } from '@entities/client/types/client';

export const emptyClientState: Client = {
  id: 0,
  name: '',
  all_limit: 0,
  balance: 0,
  critical_balance: 0,
  day_limit: 0,
  day_spent: 0,
  month_plan: 0,
  month_spent: 0,
  week_spent: 0,
};

export const selectedClient = createSlice({
  initialState: emptyClientState,
  name: '@@SELECTED_CLIENT',
  reducers: {
    selectClient(state, action) {
      return action.payload;
    },
    forgetClient(state, action) {
      return emptyClientState;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(createAction('selectClient'), (state, action) => {
    //     return action.payload;
    //   })
    //   .addCase(createAction('forgetClient'), (state, action) => {
    //     return emptyClientState;
    //   });
  },
});

export const { selectClient, forgetClient } = selectedClient.actions;
