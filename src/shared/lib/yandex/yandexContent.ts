import axios, { AxiosPromise } from 'axios';

interface YandexDownloadRequest {
  href: string;
  method: 'GET' | 'POST';
  templated: boolean;
}

export const getDownloadObject = (link: string): AxiosPromise<YandexDownloadRequest> => {
  const url = 'https://cloud-api.yandex.net/v1/disk/public/resources/download';
  return axios.get<YandexDownloadRequest>(url, {
    params: {
      public_key: link,
    },
  });
};
