import { createSlice } from '@reduxjs/toolkit';
import { AuthAPI } from '@entities/auth/api/authAPI';

type SessionSliceState = {
  isAuthorized: boolean;
};

const initialState: SessionSliceState = {
  isAuthorized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.isAuthorized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(AuthAPI.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.isAuthorized = true;
      })
      .addMatcher(AuthAPI.endpoints.logout.matchFulfilled, (state) => {
        state.isAuthorized = false;
      });
  },
});

export const selectIsAuthorized = (state: RootState) => state.auth.isAuthorized;
export const { clearSession } = authSlice.actions;
