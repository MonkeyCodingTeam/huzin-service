import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthAPI } from '@entities/auth';
import { clearUser } from '@entities/user';
import { AUTH_TAG } from '@shared/api/tags';
import { wait } from '@shared/lib';

export const logoutThunk = createAsyncThunk<void, void, { state: RootState }>(
  'authentication/logout',
  async (_: unknown, { dispatch }) => {
    await dispatch(AuthAPI.endpoints.csrf.initiate(null));
    await dispatch(AuthAPI.endpoints.logout.initiate(null)).unwrap();
    dispatch(clearUser);

    // Wait 10ms to invalidateTags in next event loop tick.
    // Otherwise after invalidate related requests with SESSION_TAG
    // will be started, but isAuthorized will still be equal to true
    await wait(10);

    // 👇 ATTENTION: This line clear all baseApi state instead of sessionApi
    // dispatch(sessionApi.util.resetApiState())
    dispatch(AuthAPI.util.invalidateTags([AUTH_TAG]));
  },
);
