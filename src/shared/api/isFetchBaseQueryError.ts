import { type AxiosError } from 'axios';

export const isFetchBaseQueryError = (
  error: unknown,
): error is { data: AxiosError; status: number } => {
  return typeof error === 'object' && error != null && Object.hasOwn(error, 'status');
};
