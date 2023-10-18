import { Layout } from 'antd';
import { LoginForm } from '@features/auth/login';
import { Logo } from '@shared/ui';
import css from './LoginPage.module.scss';

const LoginPage = () => {
  return (
    <Layout className={css.container}>
      <Logo size='xl' />
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;
