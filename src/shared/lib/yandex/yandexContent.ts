import axios, { AxiosPromise } from 'axios';
import { axiosAppInstance } from '@shared/lib/axios';

interface YandexDownloadRequest {
  href: string;
  method: 'GET' | 'POST';
  templated: boolean;
}

const YandexDownloadApi = {
  getDownloadObject: (link: string): AxiosPromise<YandexDownloadRequest> => {
    const url = 'https://cloud-api.yandex.net/v1/disk/public/resources/download';
    return axios.get<YandexDownloadRequest>(url, {
      params: {
        public_key: link,
      },
    });
  },
  getFile: (href: YandexDownloadRequest['href']): AxiosPromise<Blob> =>
    axiosAppInstance.get(href, {
      responseType: 'blob',
    }),
};

export const getDownloadObject = (link: string): AxiosPromise<YandexDownloadRequest> => {
  const url = 'https://cloud-api.yandex.net/v1/disk/public/resources/download';
  return axios.get<YandexDownloadRequest>(url, {
    params: {
      public_key: link,
    },
  });
};
