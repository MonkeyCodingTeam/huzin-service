import { axiosContentInstance } from '@shared/lib/axios';
import { AxiosPromise } from 'axios';

const BASE = `${__APP_API_URL__}/storage`;

export const ContentAPI = {
  get: (path: string) => {
    const url = path.replace(/^\//, '');
    return `${BASE}/${url}`;
  },
  downloadFromYandex: (url: string): AxiosPromise<File> =>
    axiosContentInstance.get('yandex-file', {
      params: {
        url,
      },
      responseType: 'blob',
    }),
};
