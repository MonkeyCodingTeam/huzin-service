import { Form, InputNumber, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Client, useUpdateClientMutation } from '@entities/client';
import css from './BudgetCutsEditModal.module.scss';

interface Props {
  client?: Client;
  onCancel: () => void;
}

export const BudgetCutsEditModal: React.FC<Props> = ({ client, onCancel }) => {
  const [update] = useUpdateClientMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (client) form.setFieldsValue(client);
  }, [client]);

  const onFormSubmit = () => {
    if (!client) {
      console.log('Error, check client exist: ', client);
      return;
    }
    form
      .validateFields()
      .then((values) => {
        update({ id: client.id, ...values });
        onCancel();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useEffect(() => {
    if (!client) return setIsModalOpen(false);
    setIsModalOpen(true);
  }, [client]);

  return (
    <Modal
      open={isModalOpen}
      title={client?.name}
      okText='Сохранить'
      cancelText='Отмена'
      onCancel={onCancel}
      okButtonProps={{ form: 'form_in_modal', htmlType: 'submit' }}
    >
      <Form name='form_in_modal' form={form} layout='vertical' onFinish={onFormSubmit}>
        <Form.Item
          name='month_plan'
          label='План на месяц'
          rules={[{ required: true, message: 'Введите плановую сумму расходов!' }]}
        >
          <InputNumber
            className={css.modalBody__input}
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
            className={css.modalBody__input}
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
            className={css.modalBody__input}
            placeholder={'Введите корректировку +/-'}
            controls={false}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
