import { createSlice } from '@reduxjs/toolkit';
import { Client } from '@entities/client';
import { emptyGroupState } from '@entities/group';

export const emptyClientState: Client = {
  group: emptyGroupState,
  invoices: [],
  id: 0,
  name: '',
  entrepreneur: '',
  all_limit: 0,
  balance: 0,
  critical_balance: 0,
  day_limit: 0,
  day_spent: 0,
  month_plan: 0,
  month_spent: 0,
  week_spent: 0,
  zero_days: 0,
  budget_adjustment: 0,
  is_budget_agreed: false,
  has_telegram: false,
  token: '',
  recommended_budget: null,
  current_invoice_id: null,
  low_balance_at: null,
  paid_at: null,
  zero_balance_at: null,
};

export const selectedClient = createSlice({
  initialState: emptyClientState,
  name: '@@SELECTED_CLIENT',
  reducers: {
    selectClient(state, action) {
      return action.payload;
    },
    forgetClient() {
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
