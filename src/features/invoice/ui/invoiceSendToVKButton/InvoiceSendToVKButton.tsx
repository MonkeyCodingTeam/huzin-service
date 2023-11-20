import { Button, Form, Input, Space } from 'antd';
import React, { FC } from 'react';
import { Invoice } from '@entities/invoice/model/invoice';

interface Props {
  invoiceId: Invoice['id'];
}

interface FormProps {
  vk_number: Invoice['vk_number'];
}

export const InvoiceSendToVKButton: FC<Props> = ({ invoiceId }) => {
  const handleSubmit = (value: FormProps) => {
    console.log(value, invoiceId);
    form.resetFields();
  };

  const [form] = Form.useForm<FormProps>();
  return (
    <Form form={form} onFinish={handleSubmit}>
      <Space.Compact block style={{ maxWidth: '202px' }}>
        <Form.Item
          style={{ width: '100%', marginBottom: 0 }}
          name={'vk_number'}
          rules={[
            {
              required: true,
              message: 'Необходимо указать счёт в ВК',
            },
          ]}
        >
          <Input style={{ width: '100%' }} placeholder='Счёт ВК' />
        </Form.Item>

        <Button type={'primary'} ghost htmlType='submit' style={{ padding: '0 6px' }}>
          Оплатить
        </Button>
      </Space.Compact>
    </Form>
  );
};
