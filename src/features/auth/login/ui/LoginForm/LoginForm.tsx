import { Button, Checkbox, Form, Input } from 'antd';
import { type FC } from 'react';
import { type LoginRequest } from '@entities/auth/api/types';
import { loginThunk } from '@features/auth/login';
import { useAppDispatch } from '@shared/lib';

export const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  const handleFinish = (value: LoginRequest) => {
    dispatch(loginThunk(value));
  };

  return (
    <Form
      layout='horizontal'
      name='login'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={handleFinish}
    >
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
