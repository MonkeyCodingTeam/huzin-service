import { Field, Form, Formik } from 'formik';
import { FloatInput } from '@shared/ui/FloatInput';
import css from './LoginPage.module.scss';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import HR from '@shared/assets/HR.svg';
import { AuthThunk, SignInData } from '@processes/auth';
import { Navigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@shared/lib/redux';

const LoginPage = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  if (user.id) {
    return <Navigate to={'/'} />;
  }

  const handleSubmit = (values: SignInData) => {
    return dispatch(AuthThunk.signIn(values));
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={{
          login: '',
          password: '',
        }}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div className={css.form__logo}>
            <HR />
          </div>
          <FloatInput label='Логин'>
            <Field as={InputText} name='login' className={css.form__input} />
          </FloatInput>
          <FloatInput label='Пароль'>
            <Field
              as={Password}
              name='password'
              feedback={false}
              inputClassName={css.form__input}
              className={css.form__input}
            />
          </FloatInput>
          <div className={css.form__footer}>
            <Button label='Войти' outlined />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
