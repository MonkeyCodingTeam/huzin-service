import { Button, Checkbox, Form, Input } from 'antd';
import { type FC } from 'react';
import { useLazyCsrfQuery, useLoginMutation } from '@entities/user';
import { LoginRequest } from '@entities/user/api/types';
import { ErrorAlert } from '@shared/ui/ErrorAlert/ErrorAlert';

export const LoginForm: FC = () => {
  const [csrf] = useLazyCsrfQuery();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (value: LoginRequest) => {
    await csrf(null);
    const user = await login(value);
  };

  return (
    <Form
      layout='horizontal'
      name='login'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      disabled={isLoading}
    >
      {error && <ErrorAlert error={error} />}
      <Form.Item<LoginRequest>
        label='Логин'
        name='login'
        rules={[{ required: true, message: 'Введите логин' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<LoginRequest>
        label='Пароль'
        name='password'
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item<LoginRequest>
        name='remember'
        valuePropName='checked'
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Запомнить меня</Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
