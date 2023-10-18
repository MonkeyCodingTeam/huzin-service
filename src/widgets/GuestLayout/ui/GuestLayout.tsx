import { Layout } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@shared/lib';
import css from './GuestLayout.module.scss';
import { Suspense } from 'react';
import { FullscreenLoader } from '@shared/ui';

export const GuestLayout = () => {
  const { id } = useAppSelector((state) => state.user);

  if (id) {
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
