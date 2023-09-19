import { createSlice } from '@reduxjs/toolkit';
import { ISenlerStatsRes, SenlerStatsAPI } from '@features/senlerStats';

export const senlerStatsSlice = createSlice({
  name: 'senlerStats',
  initialState: [] as ISenlerStatsRes[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      SenlerStatsAPI.endpoints.getSenlerStats.matchFulfilled,
      (state, { payload }) => payload,
    );
    builder.addMatcher(SenlerStatsAPI.endpoints.getSenlerStats.matchRejected, () => []);
  },
});
