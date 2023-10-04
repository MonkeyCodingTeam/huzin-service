import { Form, InputNumber, Modal } from 'antd';
import React, { useEffect } from 'react';
import { Client, ClientUpdateReq } from '@entities/client';
import css from './BudgetCutsEditModal.module.scss';

interface Props {
  open: boolean;
  editedClient?: Client;
  onSubmit: (values: ClientUpdateReq) => void;
  onCancel: () => void;
}

export const BudgetCutsEditModal: React.FC<Props> = ({
  open,
  onSubmit,
  onCancel,
  editedClient,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editedClient) form.setFieldsValue(editedClient);
  }, [editedClient]);

  const onFormSubmit = () => {
    if (!editedClient) {
      console.log('Error, check edited client exist ');
      return;
    }
    form
      .validateFields()
      .then((values) => {
        onSubmit({ id: editedClient.id, ...values });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={open}
      title={editedClient?.name}
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
