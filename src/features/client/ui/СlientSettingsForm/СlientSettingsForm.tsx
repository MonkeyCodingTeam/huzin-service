import { App, Button, Divider, Form, InputNumber } from 'antd';
import { forEach } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateExpensesMutation } from '@features/client';
import css from './СlientSettingsForm.module.scss';

interface FormValues {
  critical_balance: number;
  month_plan: number;
  budget_adjustment: number;

  basic_payment?: number;
}

export const ClientSettingsForm = () => {
  const [update] = useUpdateExpensesMutation();
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const client = useSelector((state: RootState) => state.selectedClient);

  const onFinish = (values: FormValues) => {
    forEach(values);
    update({ id: client.id, ...values })
      .unwrap()
      .then(() => {
        message.success('Success!');
      })
      .catch((test1) => {
        console.log(test1);
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
      onFinish={onFinish}
      autoComplete='off'
    >
      <Divider orientation='left' style={{ marginTop: '0' }}>
        Счет
      </Divider>

      <Form.Item name={'basic_payment'} label='Сумма для оплаты'>
        <InputNumber
          placeholder={
            client.entrepreneur
              ? 'Введите сумму'
              : 'Поле заблокировано, так как не указана организация'
          }
          controls={false}
          style={{ width: '100%' }}
          disabled={!client.entrepreneur}
        />
      </Form.Item>

      <Divider orientation='left' style={{ marginTop: '0' }}>
        Расходы
      </Divider>

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

      <Form.Item shouldUpdate>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Сохранить
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
