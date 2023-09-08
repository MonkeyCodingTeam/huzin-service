import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthAPI } from '@entities/auth';
import { UserAPI } from '@entities/user';
import { type LoginFormSchema } from '@features/auth/login/model/loginFormSchema';
import { isFetchBaseQueryError } from '@shared/api/isFetchBaseQueryError';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (body: LoginFormSchema, { dispatch }) => {
    try {
      await dispatch(AuthAPI.endpoints.csrf.initiate(null));
      await dispatch(AuthAPI.endpoints.login.initiate(body)).unwrap();
      await dispatch(UserAPI.endpoints.getMe.initiate(null));
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        throw new Error(error.data.message);
      }

      throw new Error('Unknown error');
    }
  },
);
