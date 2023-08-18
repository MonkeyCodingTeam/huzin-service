import { createSlice } from '@reduxjs/toolkit';
import { UserAPI } from '@entities/user';
import { type User } from './types';

const initialState: User = {
  id: 0,
  name: '',
  login: '',
  email: '',
  created_at: '',
  updated_at: '',
  roles: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(UserAPI.endpoints.me.matchFulfilled, (state, { payload }) => payload)
      .addMatcher(UserAPI.endpoints.me.matchRejected, () => initialState);
  },
});

export const { clearUser } = userSlice.actions;
