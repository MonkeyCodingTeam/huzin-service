import { Layout } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '@entities/user';
import { LogoutButton } from '@features/auth/logout/ui/LogoutButton';
import { FullscreenLoader, LayoutMenu } from '@shared/ui';
import css from './AuthLayout.module.scss';
import { Suspense } from 'react';

const { Content } = Layout;

export const AuthLayout = () => {
  const { isLoading, isError } = useGetMeQuery(null, {
    pollingInterval: 1000 * 60 * 5,
  });
  const location = useLocation();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (isError) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return (
    <Layout className={css.layout}>
      <LayoutMenu profileBlock={<LogoutButton />} />
      <Content className={css.layout__content}>
        <Suspense fallback={<FullscreenLoader />}>
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  );
};
