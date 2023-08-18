import { LoginForm } from '@features/auth/login';
import { Logo } from '@shared/ui';
import { Transition } from '@widgets/Transition';
import css from './LoginPage.module.scss';

const LoginPage = () => {
  return (
    <Transition className={css.container}>
      <Logo size='xl' />
      <LoginForm />
    </Transition>
  );
};

export default LoginPage;
