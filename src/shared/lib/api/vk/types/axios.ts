import { AxiosPromise } from 'axios';

export type AxiosResponse<T> = AxiosPromise<{ response: T }>;
