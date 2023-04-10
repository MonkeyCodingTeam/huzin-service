import { Field, Form, Formik } from 'formik';
import { FloatInput } from '@shared/ui/FloatInput';
import css from './LoginPage.module.scss';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import HR from '@shared/assets/HR.svg';
import { AuthAPI } from '@processes/auth';

interface Auth {
  login: string;
  password: string;
}

const LoginPage = () => {
  const handleSubmit = (values: Auth) => {
    AuthAPI.signIn(values);
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
