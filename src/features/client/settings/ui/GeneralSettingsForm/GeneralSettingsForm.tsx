import { Button, Divider, Form, Input, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import css from './GeneralSettingsForm.module.scss';

export const GeneralSettingsForm = () => {
  const [form] = Form.useForm();
  const client = useSelector((state: RootState) => state.selectedClient);

  const onFormSubmit = () => {
    if (!client) {
      console.log('Error, check client.ts exist: ', client);
      return;
    }
    form
      .validateFields()
      .then((values) => {
        console.log(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useEffect(() => {
    if (client) form.setFieldsValue(client);
  }, [client]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      className={css.form}
      name='basic'
      initialValues={{ remember: true }}
      onFinish={onFormSubmit}
      autoComplete='off'
    >
      <Divider orientation='left'>Счет</Divider>
      <Form.Item name={'entrepreneur'} label='Владелец' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'basic_payment'} label='Сумма для оплаты'>
        <InputNumber placeholder={'Введите сумму'} controls={false} style={{ width: '100%' }} />
      </Form.Item>

      <Divider orientation='left'>Расходы</Divider>
      <Form.Item
        name='month_plan'
        label='План на месяц'
        rules={[{ required: true, message: 'Введите плановую сумму расходов!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={'Введите плановую сумму расходов'}
          controls={false}
        />
      </Form.Item>

      <Form.Item
        name='critical_balance'
        label='Критический остаток'
        rules={[{ required: true, message: 'Введите критический остаток!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={'Введите критический остаток'}
          controls={false}
        />
      </Form.Item>
      <Form.Item
        name='budget_adjustment'
        label='Корректировка бюджета'
        rules={[{ required: true, message: 'Введите корректировку!' }]}
      >
        <InputNumber
          placeholder={'Введите корректировку +/-'}
          controls={false}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};
