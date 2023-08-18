import { type AxiosPromise } from 'axios';

export type AxiosResponse<T> = AxiosPromise<{ response: T }>;
