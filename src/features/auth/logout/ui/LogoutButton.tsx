import { Button } from 'antd';
import { useCallback } from 'react';
import { useLazyCsrfQuery, useLogoutMutation } from '@entities/user';

export const LogoutButton = () => {
  const [csrf] = useLazyCsrfQuery();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleClick = useCallback(() => {
    csrf(null).then(async () => {
      await logout(null);
    });
  }, []);

  return (
    <Button type='text' onClick={handleClick} loading={isLoading}>
      Выйти
    </Button>
  );
};
