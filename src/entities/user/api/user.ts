import type { User } from '@entities/user';
import { axiosAppInstance } from '@shared/lib/axios';
import type { AxiosPromise } from 'axios';

const Routes = {
  GET_USERS: 'user',
};

export const UserAPI = {
  getUsers: (): AxiosPromise<User[]> => axiosAppInstance.get(Routes.GET_USERS),
};
