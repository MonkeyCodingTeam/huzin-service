import { Layout } from 'antd';
import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetMeQuery } from '@entities/user';
import { useAppSelector } from '@shared/lib';
import { FullscreenLoader } from '@shared/ui';
import css from './GuestLayout.module.scss';

export const GuestLayout = () => {
  const { isLoading, isSuccess } = useGetMeQuery(null);
  const user = useAppSelector((state) => state.user);

  if (isLoading) {
    <FullscreenLoader />;
  }

  if (user.id || isSuccess) {
    return <Navigate to='/' />;
  }

  return (
    <Layout className={css.layout}>
      <Suspense fallback={<FullscreenLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
};
