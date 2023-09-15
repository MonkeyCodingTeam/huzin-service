import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Alert, Space } from 'antd';
import { FC, useCallback } from 'react';
import { isFetchBaseQueryError } from '@shared/api/isFetchBaseQueryError';

interface Props {
  error: FetchBaseQueryError | SerializedError | undefined;
}

export const ErrorAlert: FC<Props> = ({ error }) => {
  if (!error) return <></>;

  const errors = useCallback(() => {
    if (!isFetchBaseQueryError(error)) return;

    return <Alert message={error.data.message} type='error' showIcon />;
  }, [error]);

  return (
    <Space size='small' direction='vertical' style={{ padding: '1rem' }}>
      {errors()}
    </Space>
  );
};
