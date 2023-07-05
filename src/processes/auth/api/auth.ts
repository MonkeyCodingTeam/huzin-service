import { SignInData } from '@processes/auth';
import { axiosAppInstance, axiosInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';
import { emptyUserState, User } from '@entities/user';
import { createAsyncThunk } from '@reduxjs/toolkit';

const Routes = {
  SIGN_IN: '/login',
  LOGOUT: '/logout',
  GET_USER: '/me',
  CSRF_COOKIE: '/sanctum/csrf-cookie',
};

export const AuthAPI = {
  signIn: (payload: SignInData): AxiosPromise =>
    axiosInstance.get('/sanctum/csrf-cookie').then(() =>
      axiosInstance.post(Routes.SIGN_IN, payload).then((res) => {
        return res;
      }),
    ),
  logout: (): AxiosPromise => axiosInstance.post(Routes.LOGOUT),
  getUser: (): AxiosPromise<User> => axiosAppInstance.get(Routes.GET_USER),
};

export const AuthThunk = {
  signIn: createAsyncThunk(Routes.SIGN_IN, async (payload: SignInData) => {
    await AuthAPI.signIn(payload);
    const { data } = await AuthAPI.getUser();
    return data;
  }),
  logout: createAsyncThunk(Routes.LOGOUT, async () => {
    await AuthAPI.logout();
    return emptyUserState;
  }),
  getUser: createAsyncThunk(Routes.GET_USER, async () => {
    const { data } = await AuthAPI.getUser();
    return data;
  }),
};
