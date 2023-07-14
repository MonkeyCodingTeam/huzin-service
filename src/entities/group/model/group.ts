import type { Group } from '@entities/group';
import { createSlice } from '@reduxjs/toolkit';

export const emptyGroupState: Group = {
  city: '',
  id: 0,
  link: '',
  name: '',
  photo: '',
  screen_name: '',
  senler_token: '',
  timezone: 0,
};
export const selectedGroup = createSlice({
  initialState: emptyGroupState,
  name: '@@SELECTED_GROUP',
  reducers: {
    selectGroup(state, action) {
      return action.payload;
    },
    forgetGroup() {
      return emptyGroupState;
    },
  },
});

export const { selectGroup, forgetGroup } = selectedGroup.actions;
