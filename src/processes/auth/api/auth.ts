import { SignInData } from '@processes/auth/types/auth';
import { axiosInstance } from '@shared/lib/axios';

const Routes = {
  SIGN_IN: '/login',
};

export const AuthAPI = {
  signIn: (payload: SignInData) => {
    axiosInstance.get('/sanctum/csrf-cookie').then(() => {
      axiosInstance.post('/login', payload).then((r) => {
        console.log(r);
      });
    });
  },
};
