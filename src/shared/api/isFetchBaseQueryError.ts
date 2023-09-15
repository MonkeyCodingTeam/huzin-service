interface ErrorData {
  data: {
    message: string;
  };
  status: number;
}

export const isFetchBaseQueryError = (error: unknown): error is ErrorData => {
  return typeof error === 'object' && error != null && Object.hasOwn(error, 'status');
};
