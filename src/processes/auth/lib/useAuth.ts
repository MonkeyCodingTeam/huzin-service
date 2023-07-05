import { useAppSelector } from '@shared/lib/redux';
import { useMemo } from 'react';
import { User } from '@entities/user';

export const useAuth = () => {
  const user = useAppSelector((state) => state.user);
  // TODO rewrite to this where useAppSelector used for getting user

  return useMemo<User>(() => user, [user]);
};
