import { Button } from 'antd';
import { useCallback } from 'react';
import { logoutThunk } from '@features/auth/logout';
import { useAppDispatch } from '@shared/lib';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(logoutThunk());
  }, []);

  return (
    <Button type='text' onClick={handleClick}>
      Выйти
    </Button>
  );
};
