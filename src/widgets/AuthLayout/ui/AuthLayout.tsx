import { Layout } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { UserAPI } from '@entities/user';
import { LogoutButton } from '@features/auth/logout/ui/LogoutButton';
import { FullscreenLoader, LayoutMenu } from '@shared/ui';
import css from './AuthLayout.module.scss';

const { Content } = Layout;

export const AuthLayout = () => {
  const { isLoading, isError } = UserAPI.endpoints.me.useQuery(null, {
    pollingInterval: 1000 * 60 * 10,
  });

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (isError) {
    return <Navigate to='/login' />;
  }

  return (
    <Layout className={css.layout}>
      <LayoutMenu profileBlock={<LogoutButton />} />
      <Content className={css.layout__content}>
        <Outlet />
      </Content>
    </Layout>
  );
};
