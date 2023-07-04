import { useAppSelector } from '@shared/lib/redux';
import { useMemo } from 'react';
import { UserAPI } from '@entities/user';

export const useAuth = () => {
  const user = useAppSelector((state) => state.user);

  return useMemo<UserAPI>(() => user, [user]);
};
