import { Field, Form, Formik } from 'formik';
import { FloatInput } from '@shared/ui/FloatInput';
import css from './LoginPage.module.scss';
import { Button } from 'primereact/button';
import HR from '@shared/assets/HR.svg';
import { AuthThunk, SignInData } from '@processes/auth';
import { Navigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';
import classNames from 'classnames';
import { Message } from 'primereact/message';

const LoginPage = () => {
  const user = useAppSelector((state) => state.user);
  const [loginFailed, setLoginFailed] = useState(false);
  const dispatch = useAppDispatch();

  if (user.id) {
    return <Navigate to={'/'} />;
  }

  const handleSubmit = (values: SignInData) => {
    const authUser = dispatch(AuthThunk.signIn(values)).then((res) => {
      setLoginFailed(res.meta.requestStatus === 'rejected');
    });
    return authUser;
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={{
          login: '',
          password: '',
          remember: false,
        }}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className={css.form}>
            <div className={css.form__logo}>
              <HR />
            </div>
            {loginFailed && <Message severity='error' text='Неправильный логин или пароль' />}
            <FloatInput
              label='Логин'
              name='login'
              className={classNames(css.form__input, { [css.form__input__invalid]: loginFailed })}
            />
            <FloatInput
              label='Пароль'
              name='password'
              feedback={false}
              className={css.form__input}
            />
            <div className={css.form__footer}>
              <div className={css.form__footer__remember}>
                <Field as={Checkbox} inputId='remember' name='remember' checked={values.remember} />
                <label htmlFor='remember'>Запомнить меня</label>
              </div>
              <Button label='Войти' outlined />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
