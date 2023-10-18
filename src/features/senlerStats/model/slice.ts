import { createSlice } from '@reduxjs/toolkit';
import { SenlerStatsAPI, SenlerStatsRes } from '@features/senlerStats';

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
